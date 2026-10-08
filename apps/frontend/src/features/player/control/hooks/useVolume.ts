"use client";

import { useState } from "react";

export function useVolume(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const applyVolume = (v: number, muted: boolean) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = v;
    video.muted = muted;
  };

  const changeVolume = (v: number) => {
    setVolume(v);
    setIsMuted(v === 0);
    applyVolume(v, v === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const next = !isMuted;
    video.muted = next;
    setIsMuted(next);
    if (!next && volume === 0) {
      video.volume = 1;
      setVolume(1);
    }
  };

  const increaseVolume = () => {
    const video = videoRef.current;
    if (!video) return;
    const up = Math.min(video.volume + 0.1, 1);
    video.volume = up;
    video.muted = false;
    setVolume(up);
    setIsMuted(false);
  };

  const decreaseVolume = () => {
    const video = videoRef.current;
    if (!video) return;
    const down = Math.max(video.volume - 0.1, 0);
    video.volume = down;
    setVolume(down);
    setIsMuted(down === 0);
    if (down === 0) video.muted = true;
  };

  return { volume, isMuted, changeVolume, toggleMute, increaseVolume, decreaseVolume };
}
