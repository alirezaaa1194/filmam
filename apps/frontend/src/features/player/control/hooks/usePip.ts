"use client";

import { useEffect, useState } from "react";

export function usePip(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const [isPip, setIsPip] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleEnter = () => setIsPip(true);
    const handleLeave = () => setIsPip(false);
    video.addEventListener("enterpictureinpicture", handleEnter);
    video.addEventListener("leavepictureinpicture", handleLeave);
    return () => {
      video.removeEventListener("enterpictureinpicture", handleEnter);
      video.removeEventListener("leavepictureinpicture", handleLeave);
    };
  }, [videoRef]);

  const togglePip = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) await document.exitPictureInPicture();
      else await video.requestPictureInPicture();
    } catch (err) {
      console.error("PiP failed:", err);
    }
  };

  return { isPip, togglePip };
}
