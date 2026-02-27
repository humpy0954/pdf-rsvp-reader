"use client";

import { useEffect, useState, useCallback } from "react";
import { useRsvpEngine } from "@/hooks/useRsvpEngine";
import { WordDisplay } from "./WordDisplay";
import { Controls } from "./Controls";

interface RsvpPlayerProps {
  rawText: string;
}

export function RsvpPlayer({ rawText }: RsvpPlayerProps) {
  const engine = useRsvpEngine(rawText);
  const [orpEnabled, setOrpEnabled] = useState(true);
  const [fontSize, setFontSize] = useState(48);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't capture keys when typing in input/select
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          engine.togglePlayPause();
          break;
        case "ArrowLeft":
          e.preventDefault();
          engine.skipBackward(10);
          break;
        case "ArrowRight":
          e.preventDefault();
          engine.skipForward(10);
          break;
        case "ArrowUp":
          e.preventDefault();
          engine.setWpm(engine.wpm + 25);
          break;
        case "ArrowDown":
          e.preventDefault();
          engine.setWpm(engine.wpm - 25);
          break;
        case "Home":
          e.preventDefault();
          engine.jumpToStart();
          break;
      }
    },
    [engine]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="space-y-6">
      {/* Word display area */}
      <div
        className="rounded-2xl bg-surface-1 dark:bg-surface-1 border border-stone-200/60 dark:border-stone-800
          shadow-sm shadow-stone-200/50 dark:shadow-none
          overflow-hidden"
      >
        <WordDisplay
          token={engine.currentToken}
          orpEnabled={orpEnabled}
          fontSize={fontSize}
        />
      </div>

      {/* Controls */}
      <Controls
        isPlaying={engine.isPlaying}
        wpm={engine.wpm}
        currentIndex={engine.currentIndex}
        totalTokens={engine.totalTokens}
        pauseProfile={engine.pauseProfile}
        orpEnabled={orpEnabled}
        fontSize={fontSize}
        onTogglePlay={engine.togglePlayPause}
        onSkipForward={() => engine.skipForward(10)}
        onSkipBackward={() => engine.skipBackward(10)}
        onJumpToStart={engine.jumpToStart}
        onJumpToIndex={engine.jumpToIndex}
        onWpmChange={engine.setWpm}
        onPauseProfileChange={engine.setPauseProfile}
        onOrpToggle={() => setOrpEnabled((v) => !v)}
        onFontSizeChange={setFontSize}
      />
    </div>
  );
}
