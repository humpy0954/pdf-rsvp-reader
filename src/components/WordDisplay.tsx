"use client";

import { RsvpToken } from "@/lib/types";
import { useMemo } from "react";

interface WordDisplayProps {
  token: RsvpToken | null;
  orpEnabled: boolean;
  fontSize: number;
}

export function WordDisplay({ token, orpEnabled, fontSize }: WordDisplayProps) {
  const parts = useMemo(() => {
    if (!token) return null;
    const { word, orpIndex } = token;
    return {
      before: word.slice(0, orpIndex),
      orp: word[orpIndex] || "",
      after: word.slice(orpIndex + 1),
      full: word,
    };
  }, [token]);

  return (
    <div className="relative flex items-center justify-center min-h-[160px] md:min-h-[200px] overflow-hidden">
      {/* ORP guide line — thin vertical line at exact center */}
      {orpEnabled && (
        <div className="absolute top-2 bottom-2 left-1/2 w-px -translate-x-[0.5px]">
          <div className="absolute top-0 w-1.5 h-1.5 -translate-x-[2.5px] border-l-[3px] border-r-[3px] border-t-[5px] border-l-transparent border-r-transparent border-t-brand-500/60" />
          <div className="absolute bottom-0 w-1.5 h-1.5 -translate-x-[2.5px] border-l-[3px] border-r-[3px] border-b-[5px] border-l-transparent border-r-transparent border-b-brand-500/60" />
        </div>
      )}

      {/* Word display area */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="w-full"
      >
        {token && parts ? (
          orpEnabled ? (
            /*
             * Fixed-center ORP alignment:
             * - Container is full width with position:relative
             * - Three inline spans sit inside an absolutely-positioned wrapper
             * - The wrapper's left edge is at 50%, then shifted back by the width
             *   of the "before" text + half the ORP char, so the ORP char center
             *   always lands at the container's 50% mark.
             * - Using a table-like approach: left part is right-aligned in a
             *   fixed-width cell, ORP is centered, right part is left-aligned.
             */
            <div className="relative h-[1.2em] flex items-center" style={{ fontSize: `${fontSize}px`, lineHeight: "1.2" }}>
              {/* Invisible spacer to maintain height */}
              <span className="invisible font-mono font-semibold">X</span>

              {/* The three-part word, positioned so ORP char centers at 50% */}
              <span
                className="absolute whitespace-nowrap font-mono font-semibold"
                style={{
                  left: "50%",
                  /* Shift left by: (number of "before" chars * 1ch) + 0.5ch to center the ORP char */
                  transform: `translateX(calc(-${parts.before.length}ch - 0.5ch))`,
                }}
              >
                <span className="text-stone-500 dark:text-stone-400">{parts.before}</span>
                <span className="text-brand-500 font-bold">{parts.orp}</span>
                <span className="text-stone-500 dark:text-stone-400">{parts.after}</span>
              </span>
            </div>
          ) : (
            <div className="text-center">
              <span
                style={{ fontSize: `${fontSize}px` }}
                className="font-mono font-semibold text-foreground"
              >
                {parts.full}
              </span>
            </div>
          )
        ) : (
          <div className="text-center">
            <span
              className="text-stone-400 dark:text-stone-600 font-mono"
              style={{ fontSize: `${Math.max(fontSize * 0.5, 18)}px` }}
            >
              Ready to read
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
