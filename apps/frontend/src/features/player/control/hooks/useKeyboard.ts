"use client";

import { useEffect } from "react";

type Handlers = {
  onPlayPause: () => void;
  onSeek: (s: number) => void;
  onToggleMute: () => void;
  onVolumeUp: () => void;
  onVolumeDown: () => void;
};

export function useKeyboard(handlers: Handlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "BUTTON" || target.isContentEditable || target.closest("[role=tablist]") || target.closest("[role=tab]") || target.closest("[role=dialog]")) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          handlers.onPlayPause();
          break;
        case "KeyM":
          e.preventDefault();
          handlers.onToggleMute();
          break;
        case "ArrowRight":
          e.preventDefault();
          handlers.onSeek(10);
          break;
        case "ArrowLeft":
          e.preventDefault();
          handlers.onSeek(-10);
          break;
        case "ArrowUp":
          e.preventDefault();
          handlers.onVolumeUp();
          break;
        case "ArrowDown":
          e.preventDefault();
          handlers.onVolumeDown();
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
}
