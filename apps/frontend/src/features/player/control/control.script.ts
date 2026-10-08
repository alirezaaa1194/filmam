"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { AppApis } from "@/data";
import { ClientCall } from "@/scripts/client";
import { useLocale } from "@/hooks";
import { UserMovieActionType, UserMovieTypeEnum } from "@/types";
import { PlayerControlProps } from "./control.type";
import { useSaveWatchTime } from "../player.script";

export function useControlScript({ entityType, source, data }: Pick<PlayerControlProps, "entityType" | "source" | "data">) {
  const { locale } = useLocale();
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { mutate: saveWatchTime } = useSaveWatchTime();
  const lastSavedTimeRef = useRef(0);

  const videoSource = data.files.find((f) => f.type === source.toUpperCase());
  const sourceDuration = Number(videoSource?.duration) || 0;

  const [isPlaying, setIsPlaying] = useState(false);
  const [videoTime, setVideoTime] = useState(0);
  const [duration, setDuration] = useState(sourceDuration);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setDuration(sourceDuration);
  }, [sourceDuration]);

  useEffect(() => {
    lastSavedTimeRef.current = 0;
  }, [videoSource?.path]);

  const { data: userActions, isPending } = useQuery({
    queryKey: ["user-movie-actions", entityType, data.id],
    queryFn: () =>
      ClientCall<UserMovieActionType[]>(AppApis.userMovie.movieActions(data.id), {
        method: "GET",
        locale,
        query: { entity_type: entityType },
      }),
    enabled: true,
  });

  const watchingAction = userActions?.find((a) => a.type === UserMovieTypeEnum.WATCHING);
  const savedProgress = watchingAction?.progress_time ?? 0;

  const [showResumeModal, setShowResumeModal] = useState(false);
  const [hasCheckedResume, setHasCheckedResume] = useState(false);

  useEffect(() => {
    if (isPending || hasCheckedResume) return;
    if (!userActions) return;
    if (savedProgress <= 5) return;
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = savedProgress;
    }
    lastSavedTimeRef.current = savedProgress;
    setShowResumeModal(true);
    setHasCheckedResume(true);
  }, [isPending, userActions, savedProgress, hasCheckedResume]);

  const getSaveInterval = (d: number) => (d > 60 ? 30 : 10);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !sourceDuration) return;

    setVideoTime(video.currentTime);

    const interval = getSaveInterval(sourceDuration);
    const elapsed = video.currentTime - lastSavedTimeRef.current;

    if (elapsed >= interval) {
      lastSavedTimeRef.current = video.currentTime;

      const progress = video.currentTime / sourceDuration;
      const isWatched = progress >= 0.8;

      saveWatchTime({
        entityId: data.id,
        entityType,
        progressTime: video.currentTime,
        type: isWatched ? UserMovieTypeEnum.WATCHED : UserMovieTypeEnum.WATCHING,
      });
    }
  };

  const navigateToMovie = () => {
    if (entityType === "MOVIE") router.push(`/movies/${(data as any).slug}`);
    else router.push(`/movies/${(data as any).movie.slug}`);
  };

  const markAsWatched = () => {
    if (!sourceDuration) return;
    saveWatchTime({
      entityId: data.id,
      entityType,
      progressTime: sourceDuration,
      type: UserMovieTypeEnum.WATCHED,
    });
  };

  return {
    videoRef,
    videoSource,
    sourceDuration,
    isPlaying,
    setIsPlaying,
    videoTime,
    setVideoTime,
    duration,
    setDuration,
    isBuffering,
    setIsBuffering,
    hasStarted,
    setHasStarted,
    error,
    setError,
    showResumeModal,
    setShowResumeModal,
    savedProgress,
    handleTimeUpdate,
    navigateToMovie,
    markAsWatched,
  };
}
