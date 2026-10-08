"use client";

import { useState } from "react";

export function usePlaybackRate(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const [playbackRate, setPlaybackRate] = useState(1);
  const changeSpeed = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) videoRef.current.playbackRate = rate;
  };
  return { playbackRate, changeSpeed };
}
