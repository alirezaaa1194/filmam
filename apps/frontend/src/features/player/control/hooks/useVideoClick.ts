"use client";

import { useEffect, useRef } from "react";

export function useVideoClick({ onPlayPause, onSeek, showControl, setShowControl }: { onPlayPause: () => void; onSeek: (s: number) => void; showControl: boolean; setShowControl: (v: boolean) => void }) {
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleVideoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "BUTTON" || target.isContentEditable || target.closest("a") || target.closest("[role=tablist]") || target.closest("[role=tab]") || target.closest("[role=dialog]") || target.closest("[data-slot=slider]") || target.closest("[data-player-control]")) return;

    if (!showControl) {
      setShowControl(true);
      return;
    }

    if (e.detail === 1) {
      clickTimeoutRef.current = setTimeout(() => onPlayPause(), 250);
    } else if (e.detail === 2) {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
      }
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      onSeek(clickX > rect.width / 2 ? 10 : -10);
    }
  };

  useEffect(
    () => () => {
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    },
    [],
  );

  return { handleVideoClick };
}
