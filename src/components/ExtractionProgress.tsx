"use client";

import { ExtractionState } from "@/lib/types";

interface ExtractionProgressProps {
  state: ExtractionState;
  onReExtract: () => void;
  onReset: () => void;
}

export function ExtractionProgress({
  state,
  onReExtract,
  onReset,
}: ExtractionProgressProps) {
  if (state.status === "idle") return null;

  if (state.status === "loading") {
    const { currentPage, totalPages, percentage } = state.progress;
    return (
      <div className="rounded-xl bg-surface-1 dark:bg-surface-1 p-6 shadow-sm shadow-stone-200/50 dark:shadow-none border border-stone-200/60 dark:border-stone-800">
        <div className="flex items-center gap-3 mb-4">
          {/* Spinner */}
          <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
            Extracting text...
          </span>
        </div>
        <div className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
          Page {currentPage} of {totalPages}
        </p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="rounded-xl bg-red-50 dark:bg-red-950/30 p-6 border border-red-200 dark:border-red-900/50">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800 dark:text-red-300">
              Extraction failed
            </p>
            <p className="mt-1 text-sm text-red-700 dark:text-red-400">
              {state.message}
            </p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="mt-4 px-4 py-2 text-sm font-medium rounded-lg
            bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300
            hover:bg-red-200 dark:hover:bg-red-900/60
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500
            active:scale-[0.98] transition-transform duration-100"
        >
          Try another file
        </button>
      </div>
    );
  }

  if (state.status === "done") {
    return (
      <div className="rounded-xl bg-surface-1 dark:bg-surface-1 p-6 shadow-sm shadow-stone-200/50 dark:shadow-none border border-stone-200/60 dark:border-stone-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-emerald-600 dark:text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-stone-800 dark:text-stone-200 truncate max-w-[240px]">
                {state.info.fileName}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {state.info.pageCount} page{state.info.pageCount !== 1 ? "s" : ""} extracted
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onReExtract}
              className="px-3 py-1.5 text-xs font-medium rounded-lg
                bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300
                hover:bg-stone-200 dark:hover:bg-stone-700
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500
                active:scale-[0.98] transition-transform duration-100"
            >
              Re-extract
            </button>
            <button
              onClick={onReset}
              className="px-3 py-1.5 text-xs font-medium rounded-lg
                bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300
                hover:bg-stone-200 dark:hover:bg-stone-700
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500
                active:scale-[0.98] transition-transform duration-100"
            >
              New file
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
