"use client";

import { useCallback, useState, useRef } from "react";

interface PdfUploaderProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export function PdfUploader({ onFileSelected, disabled }: PdfUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type === "application/pdf") {
        onFileSelected(file);
      }
    },
    [onFileSelected]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelected(file);
      }
      // Reset input so same file can be selected again
      if (inputRef.current) inputRef.current.value = "";
    },
    [onFileSelected]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`
        relative group cursor-pointer
        rounded-2xl border-2 border-dashed
        p-12 text-center
        transition-colors duration-200
        ${
          isDragOver
            ? "border-brand-500 bg-brand-50 dark:bg-brand-950/30"
            : "border-stone-300 dark:border-stone-700 hover:border-brand-400 dark:hover:border-brand-600"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      aria-label="Upload PDF file"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      <div className="flex flex-col items-center gap-4">
        {/* Upload icon */}
        <div
          className={`
            w-16 h-16 rounded-2xl flex items-center justify-center
            transition-transform duration-200
            ${isDragOver ? "scale-110" : "group-hover:scale-105"}
            bg-brand-100 dark:bg-brand-900/40
          `}
        >
          <svg
            className="w-8 h-8 text-brand-600 dark:text-brand-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
        </div>

        <div>
          <p className="text-lg font-medium text-stone-800 dark:text-stone-200">
            {isDragOver ? "Drop your PDF here" : "Drop a PDF here or click to browse"}
          </p>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            .pdf files only — processed entirely in your browser
          </p>
        </div>
      </div>
    </div>
  );
}
