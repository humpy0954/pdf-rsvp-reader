"use client";

import { PauseProfile } from "@/lib/types";

interface ControlsProps {
  isPlaying: boolean;
  wpm: number;
  currentIndex: number;
  totalTokens: number;
  pauseProfile: PauseProfile;
  orpEnabled: boolean;
  fontSize: number;
  onTogglePlay: () => void;
  onSkipForward: () => void;
  onSkipBackward: () => void;
  onJumpToStart: () => void;
  onJumpToIndex: (index: number) => void;
  onWpmChange: (wpm: number) => void;
  onPauseProfileChange: (profile: PauseProfile) => void;
  onOrpToggle: () => void;
  onFontSizeChange: (size: number) => void;
}

export function Controls({
  isPlaying,
  wpm,
  currentIndex,
  totalTokens,
  pauseProfile,
  orpEnabled,
  fontSize,
  onTogglePlay,
  onSkipForward,
  onSkipBackward,
  onJumpToStart,
  onJumpToIndex,
  onWpmChange,
  onPauseProfileChange,
  onOrpToggle,
  onFontSizeChange,
}: ControlsProps) {
  const progress = totalTokens > 0 ? (currentIndex / (totalTokens - 1)) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    const index = Math.round(ratio * (totalTokens - 1));
    onJumpToIndex(index);
  };

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div
          className="progress-track h-1.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden"
          onClick={handleProgressClick}
          role="slider"
          aria-label="Reading progress"
          aria-valuenow={currentIndex}
          aria-valuemin={0}
          aria-valuemax={totalTokens - 1}
          tabIndex={0}
        >
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-stone-400 dark:text-stone-500 font-mono">
          <span>{currentIndex + 1}</span>
          <span>{totalTokens} words</span>
        </div>
      </div>

      {/* Transport controls */}
      <div className="flex items-center justify-center gap-2">
        {/* Jump to start */}
        <button
          onClick={onJumpToStart}
          className="p-2.5 rounded-xl text-stone-500 dark:text-stone-400
            hover:bg-stone-100 dark:hover:bg-stone-800
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500
            active:scale-95 transition-transform duration-100"
          aria-label="Jump to start (Home)"
          title="Jump to start (Home)"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Skip back 10 */}
        <button
          onClick={onSkipBackward}
          className="p-2.5 rounded-xl text-stone-500 dark:text-stone-400
            hover:bg-stone-100 dark:hover:bg-stone-800
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500
            active:scale-95 transition-transform duration-100"
          aria-label="Back 10 words (Left arrow)"
          title="Back 10 words (←)"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Play / Pause */}
        <button
          onClick={onTogglePlay}
          className="p-4 rounded-2xl bg-brand-500 text-white
            hover:bg-brand-600 dark:hover:bg-brand-400
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2
            active:scale-95 transition-transform duration-100
            shadow-lg shadow-brand-500/25"
          aria-label={isPlaying ? "Pause (Space)" : "Play (Space)"}
          title={isPlaying ? "Pause (Space)" : "Play (Space)"}
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Skip forward 10 */}
        <button
          onClick={onSkipForward}
          className="p-2.5 rounded-xl text-stone-500 dark:text-stone-400
            hover:bg-stone-100 dark:hover:bg-stone-800
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500
            active:scale-95 transition-transform duration-100"
          aria-label="Forward 10 words (Right arrow)"
          title="Forward 10 words (→)"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Settings row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* WPM slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Speed
            </label>
            <span className="text-sm font-mono font-medium text-stone-700 dark:text-stone-300">
              {wpm} <span className="text-xs text-stone-400">WPM</span>
            </span>
          </div>
          <input
            type="range"
            min={100}
            max={1200}
            step={25}
            value={wpm}
            onChange={(e) => onWpmChange(Number(e.target.value))}
            className="w-full"
            aria-label="Words per minute"
          />
          <div className="flex justify-between text-[10px] text-stone-400 dark:text-stone-500">
            <span>100</span>
            <span>↑/↓ = ±25</span>
            <span>1200</span>
          </div>
        </div>

        {/* Font size slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Font Size
            </label>
            <span className="text-sm font-mono font-medium text-stone-700 dark:text-stone-300">
              {fontSize}px
            </span>
          </div>
          <input
            type="range"
            min={24}
            max={96}
            step={4}
            value={fontSize}
            onChange={(e) => onFontSizeChange(Number(e.target.value))}
            className="w-full"
            aria-label="Display font size"
          />
        </div>
      </div>

      {/* Options row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Pause profile */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Pauses
          </label>
          <select
            value={pauseProfile}
            onChange={(e) => onPauseProfileChange(e.target.value as PauseProfile)}
            className="px-2.5 py-1.5 text-sm rounded-lg
              bg-stone-100 dark:bg-stone-800
              text-stone-700 dark:text-stone-300
              border border-stone-200 dark:border-stone-700
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <option value="light">Light</option>
            <option value="normal">Normal</option>
            <option value="heavy">Heavy</option>
          </select>
        </div>

        {/* ORP toggle */}
        <button
          onClick={onOrpToggle}
          className={`
            px-3 py-1.5 text-sm font-medium rounded-lg
            border transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500
            active:scale-[0.98] transition-transform duration-100
            ${
              orpEnabled
                ? "bg-brand-50 dark:bg-brand-950/40 border-brand-300 dark:border-brand-800 text-brand-700 dark:text-brand-300"
                : "bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400"
            }
          `}
          aria-pressed={orpEnabled}
        >
          ORP {orpEnabled ? "On" : "Off"}
        </button>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="text-center">
        <p className="text-[10px] text-stone-400 dark:text-stone-600">
          Space: play/pause &middot; ←/→: ±10 words &middot; ↑/↓: ±25 WPM &middot; Home: restart
        </p>
      </div>
    </div>
  );
}
