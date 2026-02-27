"use client";

import { useState, useCallback, useRef } from "react";
import { ExtractionState } from "@/lib/types";

export function usePdfExtractor() {
  const [state, setState] = useState<ExtractionState>({ status: "idle" });
  const [rawText, setRawText] = useState("");
  const abortRef = useRef(false);

  const extract = useCallback(async (file: File) => {
    abortRef.current = false;
    setRawText("");

    setState({
      status: "loading",
      progress: { currentPage: 0, totalPages: 0, percentage: 0 },
    });

    try {
      const arrayBuffer = await file.arrayBuffer();

      // Dynamic import of pdfjs-dist to avoid SSR issues
      const pdfjsLib = await import("pdfjs-dist");

      // Set worker source — served from public directory
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        useSystemFonts: true,
      });

      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;

      setState({
        status: "loading",
        progress: { currentPage: 0, totalPages, percentage: 0 },
      });

      let fullText = "";
      const pageTexts: string[] = [];

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        if (abortRef.current) return;

        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();

        let pageText = "";
        let lastY: number | null = null;

        for (const item of content.items) {
          if ("str" in item) {
            const textItem = item as { str: string; transform: number[] };
            const currentY = textItem.transform[5];

            if (lastY !== null && Math.abs(currentY - lastY) > 5) {
              // Line break detected by Y position change
              pageText += "\n";
            } else if (pageText.length > 0 && !pageText.endsWith(" ") && !pageText.endsWith("\n")) {
              pageText += " ";
            }

            pageText += textItem.str;
            lastY = currentY;
          }
        }

        pageTexts.push(pageText);
        fullText = pageTexts.join("\n\n");

        setState({
          status: "loading",
          progress: {
            currentPage: pageNum,
            totalPages,
            percentage: Math.round((pageNum / totalPages) * 100),
          },
        });

        // Yield to UI after each page
        await new Promise((r) => setTimeout(r, 0));
      }

      if (!fullText.trim()) {
        setState({
          status: "error",
          message:
            "No text could be extracted from this PDF. It may be a scanned document (image-only) or have no selectable text.",
        });
        return;
      }

      setRawText(fullText);
      setState({
        status: "done",
        text: fullText,
        info: {
          fileName: file.name,
          pageCount: totalPages,
        },
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred";

      if (message.includes("password") || message.includes("encrypted")) {
        setState({
          status: "error",
          message:
            "This PDF is password-protected. Please unlock it before uploading.",
        });
      } else if (message.includes("Invalid PDF")) {
        setState({
          status: "error",
          message:
            "This file doesn't appear to be a valid PDF. Please check the file and try again.",
        });
      } else {
        setState({
          status: "error",
          message: `Failed to extract text: ${message}`,
        });
      }
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current = true;
    setState({ status: "idle" });
    setRawText("");
  }, []);

  return { state, rawText, extract, reset };
}
