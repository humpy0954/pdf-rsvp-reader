"use client";

import { useCallback, useRef } from "react";
import { PdfUploader } from "@/components/PdfUploader";
import { ExtractionProgress } from "@/components/ExtractionProgress";
import { RsvpPlayer } from "@/components/RsvpPlayer";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { usePdfExtractor } from "@/hooks/usePdfExtractor";

export default function Home() {
  const { state, rawText, extract, reset } = usePdfExtractor();
  const fileRef = useRef<File | null>(null);

  const handleFileSelected = useCallback(
    (file: File) => {
      fileRef.current = file;
      extract(file);
    },
    [extract]
  );

  const handleReExtract = useCallback(() => {
    if (fileRef.current) {
      extract(fileRef.current);
    }
  }, [extract]);

  const showUploader = state.status === "idle";
  const showPlayer = state.status === "done" && rawText.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-stone-200/60 dark:border-stone-800/60">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-100">
              PDF RSVP
            </h1>
          </div>
          <DarkModeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <div className="max-w-3xl mx-auto w-full px-4 py-8 space-y-6 flex-1 flex flex-col">
          {/* Landing / Upload state */}
          {showUploader && (
            <div className="flex-1 flex flex-col items-center justify-center gap-8 py-12">
              <div className="text-center space-y-3 max-w-md">
                <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100" style={{ letterSpacing: "-0.03em" }}>
                  Speed read any PDF
                </h2>
                <p className="text-stone-500 dark:text-stone-400" style={{ lineHeight: "1.7" }}>
                  Upload a PDF and read it one word at a time with Rapid Serial Visual Presentation.
                  Everything stays in your browser — nothing is uploaded to a server.
                </p>
              </div>
              <div className="w-full max-w-lg">
                <PdfUploader onFileSelected={handleFileSelected} />
              </div>
            </div>
          )}

          {/* Extraction in progress */}
          {(state.status === "loading" || state.status === "error") && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-full max-w-lg">
                <ExtractionProgress
                  state={state}
                  onReExtract={handleReExtract}
                  onReset={reset}
                />
              </div>
            </div>
          )}

          {/* Player state */}
          {showPlayer && (
            <>
              <ExtractionProgress
                state={state}
                onReExtract={handleReExtract}
                onReset={reset}
              />
              <RsvpPlayer rawText={rawText} />
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/60 dark:border-stone-800/60">
        <div className="max-w-3xl mx-auto px-4 py-4 text-center text-xs text-stone-400 dark:text-stone-600">
          PDF RSVP Reader — All processing happens locally in your browser.
        </div>
      </footer>
    </div>
  );
}
