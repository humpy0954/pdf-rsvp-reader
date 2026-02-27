"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { RsvpToken, PauseProfile } from "@/lib/types";
import { tokenize } from "@/lib/tokenizer";

interface RsvpEngineState {
  tokens: RsvpToken[];
  currentIndex: number;
  isPlaying: boolean;
  wpm: number;
  pauseProfile: PauseProfile;
}

export function useRsvpEngine(rawText: string) {
  const [state, setState] = useState<RsvpEngineState>({
    tokens: [],
    currentIndex: 0,
    isPlaying: false,
    wpm: 350,
    pauseProfile: "normal",
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTickRef = useRef<number>(0);

  // Tokenize when rawText or profile changes
  useEffect(() => {
    if (rawText) {
      const tokens = tokenize(rawText, state.pauseProfile);
      setState((prev) => ({
        ...prev,
        tokens,
        currentIndex: 0,
        isPlaying: false,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        tokens: [],
        currentIndex: 0,
        isPlaying: false,
      }));
    }
    // Only re-tokenize on rawText change, not profile (profile handled separately)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawText]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleNext = useCallback(() => {
    const s = stateRef.current;
    if (!s.isPlaying || s.currentIndex >= s.tokens.length - 1) {
      if (s.currentIndex >= s.tokens.length - 1) {
        setState((prev) => ({ ...prev, isPlaying: false }));
      }
      return;
    }

    const token = s.tokens[s.currentIndex];
    const baseDelay = 60000 / s.wpm; // ms per word at current WPM
    const delay = baseDelay * token.delayMultiplier;

    const now = performance.now();
    const elapsed = now - lastTickRef.current;
    const drift = elapsed > delay ? elapsed - delay : 0;
    const adjustedDelay = Math.max(1, delay - drift);

    timerRef.current = setTimeout(() => {
      lastTickRef.current = performance.now();
      setState((prev) => {
        const nextIndex = prev.currentIndex + 1;
        if (nextIndex >= prev.tokens.length) {
          return { ...prev, currentIndex: nextIndex - 1, isPlaying: false };
        }
        return { ...prev, currentIndex: nextIndex };
      });
    }, adjustedDelay);
  }, []);

  // Scheduling loop: runs whenever currentIndex or isPlaying changes
  useEffect(() => {
    if (state.isPlaying) {
      scheduleNext();
    }
    return () => stop();
  }, [state.isPlaying, state.currentIndex, scheduleNext, stop]);

  const play = useCallback(() => {
    const s = stateRef.current;
    if (s.tokens.length === 0) return;

    // If at end, restart
    if (s.currentIndex >= s.tokens.length - 1) {
      setState((prev) => ({ ...prev, currentIndex: 0, isPlaying: true }));
    } else {
      lastTickRef.current = performance.now();
      setState((prev) => ({ ...prev, isPlaying: true }));
    }
  }, []);

  const pause = useCallback(() => {
    stop();
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, [stop]);

  const togglePlayPause = useCallback(() => {
    if (stateRef.current.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [play, pause]);

  const skipForward = useCallback((count: number = 10) => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.min(prev.currentIndex + count, prev.tokens.length - 1),
    }));
  }, []);

  const skipBackward = useCallback((count: number = 10) => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.max(prev.currentIndex - count, 0),
    }));
  }, []);

  const jumpToStart = useCallback(() => {
    setState((prev) => ({ ...prev, currentIndex: 0, isPlaying: false }));
  }, []);

  const jumpToIndex = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.max(0, Math.min(index, prev.tokens.length - 1)),
    }));
  }, []);

  const setWpm = useCallback((wpm: number) => {
    setState((prev) => ({ ...prev, wpm: Math.max(100, Math.min(1200, wpm)) }));
  }, []);

  const setPauseProfile = useCallback(
    (profile: PauseProfile) => {
      const tokens = tokenize(rawText, profile);
      setState((prev) => ({ ...prev, pauseProfile: profile, tokens }));
    },
    [rawText]
  );

  const currentToken = state.tokens[state.currentIndex] || null;

  return {
    ...state,
    currentToken,
    totalTokens: state.tokens.length,
    play,
    pause,
    togglePlayPause,
    skipForward,
    skipBackward,
    jumpToStart,
    jumpToIndex,
    setWpm,
    setPauseProfile,
  };
}
