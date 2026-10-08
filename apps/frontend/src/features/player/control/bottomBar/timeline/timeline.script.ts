"use client";

import { useState } from "react";

export function useTimeline(videoRef: React.RefObject<HTMLVideoElement | null>, setVideoTime: (t: number) => void) {
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);

  const onValueChange = (value: number[]) => {
    setIsSeeking(true);
    setSeekValue(value[0]);
  };

  const onValueCommit = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setVideoTime(value[0]);
    }
    setIsSeeking(false);
  };

  return { isSeeking, seekValue, onValueChange, onValueCommit };
}
