"use client";

import { useRef, useState, useCallback, useEffect } from "react";

export function useControlsVisibility(isBuffering: boolean) {
  const [showControl, setShowControl] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRefForCheck = useRef<HTMLVideoElement | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startHideTimer = useCallback(() => {
    clearTimer();
    if (videoRefForCheck.current?.paused || isBuffering) return;
    timeoutRef.current = setTimeout(() => setShowControl(false), 4000);
  }, [clearTimer, isBuffering]);

  const handleMouseEnter = useCallback(() => {
    clearTimer();
    setShowControl(true);
  }, [clearTimer]);

  const handleMouseLeave = useCallback(() => startHideTimer(), [startHideTimer]);

  const handleMouseMove = useCallback(() => {
    if (!showControl) {
      setShowControl(true);
      return;
    }
    startHideTimer();
  }, [showControl, startHideTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  return {
    showControl,
    setShowControl,
    setVideoRefForCheck: (el: HTMLVideoElement | null) => (videoRefForCheck.current = el),
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove,
  };
}
