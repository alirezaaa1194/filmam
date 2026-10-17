"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

  const queueWatchSave = useCallback((payload: {
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
  }, [entityType, saveWatchTimeAsync]);

  const saveProgressIfDue = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const actualDuration = Number.isFinite(video.duration) && video.duration > 0
      ? video.duration
      : sourceDuration;
    if (!actualDuration) return;

    const interval = actualDuration > 60 ? 30 : 10;
    const elapsed = video.currentTime - lastSavedTimeRef.current;
    if (elapsed < interval) return;

    // Advance by whole intervals so delayed browser timers do not drift the
    // next save farther and farther from the requested cadence.
    const progressTime = Math.floor(video.currentTime);
    lastSavedTimeRef.current = progressTime;
    void queueWatchSave({
      entityId: data.id,
      entityType,
      progressTime,
      type: UserMovieTypeEnum.WATCHING,
    }).catch((error) => console.error("Failed to save watch progress", error));
  }, [data.id, entityType, queueWatchSave, sourceDuration]);

  useEffect(() => {
    if (!isPlaying) return;
    // `timeupdate` is browser-throttled and can be irregular. Poll playback
    // time while playing so crossing the save interval is always detected.
    const timer = window.setInterval(saveProgressIfDue, 1000);
    return () => window.clearInterval(timer);
  }, [isPlaying, saveProgressIfDue]);

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
    saveProgressIfDue();
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
