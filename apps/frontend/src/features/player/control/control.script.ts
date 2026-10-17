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
  const { mutateAsync: saveWatchTimeAsync } = useSaveWatchTime();
  const lastSavedTimeRef = useRef(0);
  const pendingWatchSaveRef = useRef<Promise<void>>(Promise.resolve());

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

  const queueWatchSave = (payload: {
    entityId: number;
    entityType: typeof entityType;
    progressTime: number;
    type: UserMovieTypeEnum;
  }) => {
    const request = pendingWatchSaveRef.current.then(async () => {
      await saveWatchTimeAsync(payload);
    });
    pendingWatchSaveRef.current = request.catch(() => {});
    return request;
  };

  const saveCompletedWatchStatus = async (progressTime: number) => {
    try {
      await queueWatchSave({
        entityId: data.id,
        entityType,
        progressTime,
        type: UserMovieTypeEnum.WATCHING,
      });
      await queueWatchSave({
        entityId: data.id,
        entityType,
        progressTime,
        type: UserMovieTypeEnum.WATCHED,
      });
    } catch (error) {
      console.error("Failed to save final watch status", error);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    setVideoTime(video.currentTime);

    // The file's stored duration can be missing or stale. Use the browser's
    // media metadata when available so short videos still get their 10s saves.
    const actualDuration = Number.isFinite(video.duration) && video.duration > 0
      ? video.duration
      : sourceDuration;
    if (!actualDuration) return;

    const interval = getSaveInterval(actualDuration);
    const elapsed = video.currentTime - lastSavedTimeRef.current;

    if (elapsed >= interval) {
      lastSavedTimeRef.current = video.currentTime;

      void queueWatchSave({
        entityId: data.id,
        entityType,
        progressTime: Math.floor(video.currentTime),
        type: UserMovieTypeEnum.WATCHING,
      }).catch((error) => console.error("Failed to save watch progress", error));
    }
  };

  const handleVideoEnded = () => {
    const video = videoRef.current;
    const finalProgress = Math.floor(
      video && Number.isFinite(video.duration) && video.duration > 0
        ? video.duration
        : sourceDuration,
    );
    if (!finalProgress) return;

    lastSavedTimeRef.current = finalProgress;
    setVideoTime(finalProgress);

    void saveCompletedWatchStatus(finalProgress);
  };

  const navigateToMovie = () => {
    if (entityType === "MOVIE") router.push(`/movies/${(data as any).slug}`);
    else router.push(`/movies/${(data as any).movie.slug}`);
  };

  const markAsWatched = () => {
    if (!sourceDuration) return;
    void saveCompletedWatchStatus(sourceDuration);
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
    handleVideoEnded,
    navigateToMovie,
    markAsWatched,
  };
}
