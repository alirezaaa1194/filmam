"use client";

import { useEffect, useState } from "react";

export function useFullscreen(containerRef: React.RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleChange = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      if (!fs) {
        // @ts-ignore
        screen.orientation?.unlock?.();
      }
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        // @ts-ignore
        await screen.orientation?.lock?.("landscape").catch(() => {});
      } else {
        await document.exitFullscreen();
        // @ts-ignore
        screen.orientation?.unlock?.();
      }
    } catch (err) {
      console.error("Fullscreen failed:", err);
    }
  };

  return { isFullscreen, toggleFullscreen };
}
