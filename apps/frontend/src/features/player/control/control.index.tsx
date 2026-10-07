"use client";

import { ArrowRight2, Backward10Seconds, Forward10Seconds, Maximize2, Next, Pause, Play, TimerStart, VolumeCross, VolumeHigh, Warning2 } from "iconsax-react";
import { CommentEntityTypeEnum, EpisodeDetailPublicType, FileTypeEnum, MovieDetailPublicType, MovieTypeEnum, UserMovieActionType, UserMovieTypeEnum } from "../../../types";
import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Spinner } from "../../../utilities/components/ui";
import { Slider } from "../../../utilities/components/ui/slider";
import { useLocale } from "../../../hooks";
import { use, useEffect, useRef, useState } from "react";
import { TimerParser } from "../../../scripts";
import { Minimize2, PictureInPicture2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserContext } from "../../../contexts";
import PlayerUserActionsComp from "./userActions/userActions.index";
import { useSaveWatchTime } from "../player.script";
import { useQuery } from "@tanstack/react-query";
import { AppApis } from "../../../data";
import { ClientCall } from "../../../scripts/client";
import PlayerEpisodesModalComp from "./episodesModal/episodesModal.index";

type PlayerControlProps =
  | {
      entityType: CommentEntityTypeEnum.MOVIE;
      source: FileTypeEnum.FILM | FileTypeEnum.TRAILER;
      data: MovieDetailPublicType;
    }
  | {
      entityType: CommentEntityTypeEnum.EPISODE;
      source: FileTypeEnum.FILM | FileTypeEnum.TRAILER;
      data: EpisodeDetailPublicType;
    };

function PlayerControlComp({ entityType, source, data }: PlayerControlProps) {
  const { dir, locale } = useLocale();
  const [showControl, setShowControl] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [videoTime, setVideoTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPip, setIsPip] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [autoNextEpisode, setAutoNextEpisode] = useState(true);
  const [ripple, setRipple] = useState<{ type: "play" | "pause" | "forward" | "backward"; id: number } | null>(null);
  const [openControl, setOpenControl] = useState(false);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const user = use(UserContext);

  // const toggleFullscreen = async () => {
  //   const container = videoRef.current?.parentElement;
  //   if (!container) return;

  //   try {
  //     if (!document.fullscreenElement) {
  //       await container.requestFullscreen();
  //     } else {
  //       await document.exitFullscreen();
  //     }
  //   } catch (err) {
  //     console.error("Fullscreen failed:", err);
  //   }
  // };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        // 1. ابتدا fullscreen کن
        await document.documentElement.requestFullscreen();

        // 2. سپس سعی کن به landscape قفل کنی
        // @ts-ignore - برای پشتیبانی از مرورگرهای قدیمی‌تر
        await screen.orientation?.lock?.("landscape").catch(() => {});
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen failed:", err);
    }
  };

  const togglePip = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (err) {
      console.error("PiP failed:", err);
    }
  };

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
  }, []);

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const videoSource = data.files.find((file) => file.type === source.toUpperCase());

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startHideTimer = () => {
    clearTimer();
    if (videoRef.current?.paused || isBuffering) return;
    timeoutRef.current = setTimeout(() => {
      setShowControl(false);
    }, 4000);
  };

  const handleMouseEnter = () => {
    clearTimer();
    setShowControl(true);
  };

  const handleMouseLeave = () => {
    startHideTimer();
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const handleMouseMove = () => {
    if (!showControl) {
      setShowControl(true);
      return;
    }
    startHideTimer();
  };

  if (!videoSource || error) {
    return (
      <main className="relative w-full h-screen bg-gray-14 flex flex-col items-center justify-center gap-6 select-none" dir={dir}>
        <div className="flex flex-col items-center gap-3">
          <div className="size-16 rounded-full bg-error/10 flex items-center justify-center">
            <Warning2 className="size-8 stroke-error" />
          </div>
          <h3 className="text-white text-h-6 font-bold">پخش با خطا مواجه شد</h3>
          <p className="text-gray-8 text-body-xxs text-center max-w-md">متأسفانه در پخش این ویدیو مشکلی پیش آمد. لطفاً دوباره تلاش کنید یا به صفحه‌ی قبل بازگردید.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              setError(false);
              const video = videoRef.current;
              if (video) {
                video.load();
                video.play().catch(() => {});
              }
            }}
            className="bg-primary hover:bg-primary-shade-1 text-white cursor-pointer h-11 rounded-md px-6"
          >
            تلاش مجدد
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (entityType === CommentEntityTypeEnum.EPISODE) {
                router.push(`/movies/${data.movie.slug}`);
              } else {
                router.push(`/movies/${data.slug}`);
              }
            }}
            className="border-white/30 text-white hover:bg-white/10 cursor-pointer h-11 rounded-md px-6"
          >
            بازگشت
          </Button>
        </div>
      </main>
    );
  }

  const changeSpeed = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video) return;

      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          if (video.paused) {
            video.play().catch((err) => {
              if (err.name !== "AbortError") console.error(err);
            });
          } else {
            video.pause();
          }
          break;

        case "KeyM": {
          e.preventDefault();
          const next = !video.muted;
          video.muted = next;
          setIsMuted(next);
          if (!next && video.volume === 0) {
            video.volume = 1;
            setVolume(1);
          }
          break;
        }

        case "ArrowRight":
          e.preventDefault();
          video.currentTime = Math.min(video.currentTime + 10, video.duration);
          break;

        case "ArrowLeft":
          e.preventDefault();
          video.currentTime = Math.max(video.currentTime - 10, 0);
          break;

        case "ArrowUp": {
          e.preventDefault();
          const up = Math.min(video.volume + 0.1, 1);
          video.volume = up;
          video.muted = false;
          setVolume(up);
          setIsMuted(false);
          break;
        }

        case "ArrowDown": {
          e.preventDefault();
          const down = Math.max(video.volume - 0.1, 0);
          video.volume = down;
          setVolume(down);
          setIsMuted(down === 0);
          if (down === 0) video.muted = true;
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const { mutate: saveWatchTime } = useSaveWatchTime();
  const lastSavedTimeRef = useRef(0);

  const getSaveInterval = (duration: number) => (duration < 30 ? 10 : 30);

  const showRipple = (type: "play" | "pause" | "forward" | "backward") => {
    setRipple({ type, id: Date.now() });
    setTimeout(() => setRipple(null), 600);
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });
      showRipple("play");
    } else {
      video.pause();
      showRipple("pause");
    }
  };

  const seekBy = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    if (seconds > 0) {
      video.currentTime = Math.min(video.currentTime + seconds, video.duration);
      showRipple("forward");
    } else {
      video.currentTime = Math.max(video.currentTime + seconds, 0);
      showRipple("backward");
    }
  };

  const handleVideoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "BUTTON" || target.isContentEditable || target.closest("[role=tablist]") || target.closest("[role=tab]") || target.closest("[role=dialog]")) {
      return;
    }

    if (e.detail === 1) {
      clickTimeoutRef.current = setTimeout(() => {
        handlePlayPause();
      }, 250);
    } else if (e.detail === 2) {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const isRightSide = clickX > rect.width / 2;

      seekBy(isRightSide ? 10 : -10);
    }
  };

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, []);

  const { data: userActions, isPending } = useQuery({
    queryKey: ["user-movie-actions", entityType, data.id],
    queryFn: () =>
      ClientCall<UserMovieActionType[]>(AppApis.userMovie.movieActions(data.id), {
        method: "GET",
        locale,
        query: { entity_type: entityType },
      }),
    enabled: !!user,
  });

  const watchingAction = userActions?.find((a) => a.type === UserMovieTypeEnum.WATCHING);

  const savedProgress = watchingAction?.progress_time ?? 0;

  const [showResumeModal, setShowResumeModal] = useState(false);
  const [hasCheckedResume, setHasCheckedResume] = useState(false);

  useEffect(() => {
    if (!user || isPending || hasCheckedResume) return;
    if (!userActions) return;
    if (savedProgress <= 5) return;
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = savedProgress;
    }
    setShowResumeModal(true);
    setHasCheckedResume(true);
  }, [user, isPending, userActions, savedProgress, hasCheckedResume]);

  useEffect(() => {
    setError(false);
  }, [videoSource?.path]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setOpenControl(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <main>
      <Dialog
        open={showResumeModal}
        onOpenChange={(open) => {
          setShowResumeModal(open);
          if (!open) {
            videoRef.current?.play().catch(() => {});
          }
        }}
      >
        <DialogContent showHeader={false} className="bg-gray-14/95 backdrop-blur-[20px] border-white/20 text-white max-w-md p-6" dir={dir}>
          <DialogHeader>
            <DialogTitle className="text-white">ادامه‌ی تماشا</DialogTitle>
            <DialogDescription className="text-white/70">شما قبلاً این ویدیو را تا {TimerParser(Math.floor(savedProgress), true)} تماشا کرده‌اید. از کجا ادامه می‌دهید؟</DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-8">
            <Button
              onClick={() => {
                const video = videoRef.current;
                if (video) {
                  video.currentTime = savedProgress;
                  video.play().catch(() => {});
                }
                setShowResumeModal(false);
              }}
              className="bg-primary hover:bg-primary-shade-1 text-white cursor-pointer h-10 rounded-md flex-1"
            >
              ادامه از {TimerParser(Math.floor(savedProgress), true)}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                const video = videoRef.current;
                if (video) {
                  video.currentTime = 0;
                  video.play().catch(() => {});
                }
                saveWatchTime({
                  entityId: data.id,
                  entityType,
                  progressTime: 0,
                  type: UserMovieTypeEnum.WATCHING,
                });
                setShowResumeModal(false);
              }}
              className="border-white/30 text-white hover:bg-white/10 cursor-pointer h-10 rounded-md flex-1"
            >
              شروع از ابتدا
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="relative select-none" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove} onClick={handleVideoClick}>
        {isBuffering ? <Spinner className="absolute m-auto inset-0 size-10 text-primary" /> : null}

        <video
          src={videoSource.path}
          className="w-full h-screen bg-gray-13"
          ref={videoRef}
          onPlay={() => {
            setIsPlaying(true);
            setHasStarted(true);
            startHideTimer();
          }}
          onPause={() => {
            setIsPlaying(false);
            clearTimer();
          }}
          onTimeUpdate={() => {
            const video = videoRef.current;
            if (!video || isSeeking) return;

            setVideoTime(video.currentTime);

            if (!user) return;

            const interval = getSaveInterval(video.duration);
            const elapsed = video.currentTime - lastSavedTimeRef.current;

            if (elapsed >= interval) {
              lastSavedTimeRef.current = video.currentTime;

              const progress = video.currentTime / video.duration;
              const isWatched = progress >= 0.8;

              saveWatchTime({
                entityId: data.id,
                entityType,
                progressTime: video.currentTime,
                type: isWatched ? UserMovieTypeEnum.WATCHED : UserMovieTypeEnum.WATCHING,
              });
            }
          }}
          onWaiting={() => hasStarted && setIsBuffering(true)}
          onCanPlay={() => hasStarted && setIsBuffering(false)}
          onPlaying={() => hasStarted && setIsBuffering(false)}
          onSeeking={() => hasStarted && setIsBuffering(true)}
          onSeeked={() => hasStarted && setIsBuffering(false)}
          onError={() => {
            if (!error) setError(true);
          }}
        />

        {videoTime >= Number(videoSource.duration) - Number(videoSource.outro_duration) && entityType === CommentEntityTypeEnum.EPISODE && data.next_episode && autoNextEpisode ? (
          <div className="flex items-center gap-2 absolute bottom-60 inset-s-5 lg:inset-s-12 z-10">
            <Button
              className="bg-gray-14/50! backdrop-blur-[20px] rounded-md cursor-pointer text-body-xs! font-bold! px-4 h-10 relative"
              onClick={() => {
                if (!autoNextEpisode) return;

                if (videoRef.current) {
                  videoRef.current.pause();
                  videoRef.current.currentTime = 0;
                }
                if (!data.next_episode?.slug) return;
                router.push(`/player/episode/${data.next_episode.slug}?source=FILM`);
              }}
            >
              <span
                className="block absolute top-0 inset-s-0 -z-[1] h-full rounded-md bg-gray-14 w-full animate-shrink"
                onAnimationEnd={() => {
                  if (!autoNextEpisode) return;

                  if (videoRef.current) {
                    videoRef.current.pause();
                    videoRef.current.currentTime = 0;
                  }
                  if (!data.next_episode?.slug) return;
                  router.push(`/player/episode/${data.next_episode.slug}?source=FILM`);
                }}
              />
              قسمت بعدی
            </Button>
            <Button
              className="bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] rounded-md cursor-pointer text-caption-md! font-bold! h-10"
              onClick={() => {
                setAutoNextEpisode(false);
              }}
            >
              <X />
            </Button>
          </div>
        ) : null}
        {videoTime >= Number(videoSource.intro_start_time) && videoTime <= Number(videoSource.intro_start_time) + Number(videoSource.intro_duration) ? (
          <Button
            className="bg-white text-black hover:bg-white/80 rounded-md cursor-pointer text-caption-md! font-bold! absolute bottom-48 inset-e-5 lg:inset-e-12 z-10"
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.currentTime += Number(videoSource.intro_duration);
              }
            }}
          >
            رد کردن تیتراژ
          </Button>
        ) : null}

        {ripple && (
          <div key={ripple.id} className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="size-20 rounded-full bg-black/60 backdrop-blur-[20px] flex items-center justify-center animate-[ripple_600ms_ease-out_forwards]">
              {ripple.type === "play" && <Play className="size-10 fill-white" />}
              {ripple.type === "pause" && <Pause className="size-10 fill-white" />}
              {ripple.type === "forward" && <Forward10Seconds className="size-10 stroke-white" />}
              {ripple.type === "backward" && <Backward10Seconds className="size-10 stroke-white" />}
            </div>
          </div>
        )}

        <div className={`w-full h-screen absolute top-0 right-0 flex flex-col justify-between transition-all duration-300 ${showControl ? "opacity-100 visible" : "opacity-0 invisible"}`}>
          <div className="w-full flex items-center justify-between pt-4 px-3 lg:p-10">
            <Button
              className="h-11 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer flex gap-2 border border-white/50 hover:border-white px-6"
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.pause();
                  videoRef.current.currentTime = 0;
                }
                if (entityType === CommentEntityTypeEnum.EPISODE) {
                  router.push(`/movies/${data.movie.slug}`);
                } else {
                  router.push(`/movies/${data.slug}`);
                }
              }}
            >
              <ArrowRight2 className={`size-5 stroke-white ${dir === "ltr" ? "rotate-180" : ""}`} />
              <span className="text-white text-caption-md lg:text-body-xxs font-bold">بازگشت</span>
            </Button>
            {user && source === FileTypeEnum.FILM ? <PlayerUserActionsComp entityType={entityType} entityId={data.id} /> : null}
          </div>

          <div className="w-full pb-4 px-3 lg:p-10 flex flex-col gap-6 bg-gradient-to-t from-black/75 to-transparent">
            <div className="flex flex-col gap-1">
              <h6 className="text-white text-body-xxs font-bold lg:text-h-6">{entityType === CommentEntityTypeEnum.MOVIE ? (data.type === MovieTypeEnum.SERIES ? `سریال ${data.title}` : `سینمایی ${data.title}`) : `سریال ${data.movie.title}`}</h6>
              {entityType === CommentEntityTypeEnum.EPISODE ? (
                <span className="text-white text-caption-md lg:text-body-xxs">
                  {Number(data.movie.seasons_count) > 1 ? `فصل ${data.season.order}` : ""} قسمت {data.order}
                </span>
              ) : null}
            </div>

            <div className="w-full flex flex-col gap-3 lg:gap-7">
             <div className="flex items-center justify-between order-2 lg:order-1 min-w-0">
  {/* کنترل‌های سمت چپ */}
  <div
    className={`
      flex items-center
      bg-gray-14
      lg:bg-transparent
      rounded-full
      px-2 py-1
      min-w-0
      ml-auto
    `}
  >
    {/* کنترل‌های باز/بسته شونده */}
    <div
      className={`
        overflow-hidden
        transition-[max-width,opacity]
        duration-300
        ease-in-out
        min-w-0
        ${openControl
          ? "max-w-[calc(100vw-180px)] opacity-100"
          : "max-w-[calc(100vw-400px)] opacity-0"
        }
        lg:max-w-full
        lg:opacity-100
        lg:overflow-visible
      `}
    >
      <div className="flex items-center gap-2 lg:gap-4 w-max">
        <Button
          onClick={toggleFullscreen}
          className="size-11 lg:size-12 shrink-0 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer hover:shadow-[0_0_3px_var(--color-gray-12)]"
        >
          {isFullscreen ? (
            <Minimize2 className="size-5 stroke-white" />
          ) : (
            <Maximize2 className="size-5 stroke-white" />
          )}
        </Button>

        <Button
          onClick={togglePip}
          className="size-11 lg:size-12 shrink-0 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer hover:shadow-[0_0_3px_var(--color-gray-12)]"
        >
          <PictureInPicture2 className="size-5 stroke-white" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="size-11 lg:size-12 shrink-0 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer hover:shadow-[0_0_3px_var(--color-gray-12)]"
            >
              <span className="text-white text-xs font-bold">
                {playbackRate}x
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="center"
            side="top"
            className="bg-gray-14/90 backdrop-blur-[20px] border-white/20"
          >
            {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
              <DropdownMenuItem
                key={rate}
                onClick={() => changeSpeed(rate)}
                className="text-white cursor-pointer justify-center"
              >
                {rate}x
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {entityType === CommentEntityTypeEnum.EPISODE &&
        data.next_episode ? (
          <Button
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
              }

              if (!data.next_episode?.slug) return;

              setAutoNextEpisode(true);
              router.push(
                `/player/episode/${data.next_episode.slug}?source=FILM`
              );
            }}
            className="size-11 lg:size-12 shrink-0 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer hover:shadow-[0_0_3px_var(--color-gray-12)]"
          >
            <Next className="size-5 stroke-white" />
          </Button>
        ) : null}

        {entityType === CommentEntityTypeEnum.EPISODE &&
        source === FileTypeEnum.FILM ? (
          <PlayerEpisodesModalComp
            movie={data.movie}
            activeEpisodeId={data.id}
            activeSeasonSlug={data.season.slug}
          />
        ) : null}
      </div>
    </div>

    {/* جداکننده فقط وقتی کنترل‌ها باز هستند */}
    <span
      className={`
        w-px h-4 bg-gray-11 shrink-0
        transition-all duration-300
        ${openControl ? "mx-2 opacity-100" : "mx-0 opacity-0 w-0"}
        lg:mx-2 lg:opacity-100 lg:w-px
      `}
    />

    {/* Toggle */}
    <Button
      onClick={() => setOpenControl((prev) => !prev)}
      className="size-7 shrink-0 bg-transparent! cursor-pointer flex lg:hidden"
    >
      <ArrowRight2
        className={`
          size-5 stroke-white
          transition-transform duration-300
          ${openControl ? "rotate-180" : ""}
        `}
      />
    </Button>
  </div>

  {/* کنترل‌های سمت راست */}
  <div className="flex items-center gap-4 min-w-0 shrink-0">
    <div className="h-11 lg:h-12 hover:w-40 w-11 lg:w-12 transition-all flex items-center justify-end bg-gray-14 lg:bg-transparent lg:hover:bg-gray-14 rounded-full overflow-hidden group/volume">
      <div className="px-3 flex-1 min-w-0">
        <Slider
          dir="ltr"
          className="
            group/slider
            [&_[data-slot=slider-thumb]]:opacity-0
            [&_[data-slot=slider-thumb]]:transition-opacity
            [&_[data-slot=slider-thumb]]:duration-150
            [&_[data-slot=slider-thumb]]:group-hover/slider:opacity-100
            [&_[data-slot=slider-thumb]]:focus-visible:opacity-100
          "
          value={[isMuted ? 0 : volume]}
          max={1}
          step={0.01}
          onPointerEnter={startHideTimer}
          onValueChange={(value) => {
            startHideTimer();

            const v = value[0];

            setVolume(v);
            setIsMuted(v === 0);

            if (videoRef.current) {
              videoRef.current.volume = v;
              videoRef.current.muted = v === 0;
            }
          }}
        />
      </div>

      <Button
        onClick={() => {
          if (!videoRef.current) return;

          const next = !isMuted;

          videoRef.current.muted = next;
          setIsMuted(next);

          if (!next && volume === 0) {
            videoRef.current.volume = 1;
            setVolume(1);
          }
        }}
        className="size-11 lg:size-12 shrink-0 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer hover:shadow-[0_0_3px_var(--color-gray-12)]"
      >
        {isMuted || volume === 0 ? (
          <VolumeCross className="size-5 stroke-white" />
        ) : (
          <VolumeHigh className="size-5 stroke-white" />
        )}
      </Button>
    </div>

    <Button
      onClick={() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          setAutoNextEpisode(true);
        }
      }}
      className="size-11 lg:size-12 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer hover:shadow-[0_0_3px_var(--color-gray-12)] hidden lg:flex"
    >
      <TimerStart className="size-5 stroke-white" />
    </Button>

    <Button
      onClick={() => {
        if (videoRef.current) {
          videoRef.current.currentTime = Math.min(
            videoRef.current.currentTime + 10,
            videoRef.current.duration
          );
        }
      }}
      className="size-11 lg:size-12 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer hover:shadow-[0_0_3px_var(--color-gray-12)] hidden lg:flex"
    >
      <Forward10Seconds className="size-5 stroke-white" />
    </Button>

    <Button
      onClick={() => {
        if (videoRef.current) {
          videoRef.current.currentTime = Math.max(
            videoRef.current.currentTime - 10,
            0
          );
        }
      }}
      className="size-11 lg:size-12 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer hover:shadow-[0_0_3px_var(--color-gray-12)] hidden lg:flex"
    >
      <Backward10Seconds className="size-5 stroke-white" />
    </Button>

    <Button
      onClick={() => {
        if (videoRef.current) {
          if (isPlaying) {
            videoRef.current.pause();
          } else {
            videoRef.current.play();
          }
        }
      }}
      disabled={isBuffering}
      className="size-11 lg:size-12 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer hover:shadow-[0_0_3px_var(--color-gray-12)] disabled:opacity-100 hidden lg:flex"
    >
      {!isPlaying || isBuffering ? (
        <Play className="size-5 fill-white" />
      ) : (
        <Pause className="size-5 fill-white" />
      )}
    </Button>
  </div>
</div>

              <div className="flex flex-col-reverse lg:flex-col gap-1.5 order-1 lg:order-2">
                <div
                  className="
                  group/slider
                  [&_[data-slot=slider-thumb]]:opacity-0
                  [&_[data-slot=slider-thumb]]:transition-opacity
                  [&_[data-slot=slider-thumb]]:duration-150
                  [&_[data-slot=slider-thumb]]:group-hover/slider:opacity-100
                  [&_[data-slot=slider-thumb]]:focus-visible:opacity-100
                  [&_[data-slot=slider-track]]:h-1
                  [&_[data-slot=slider-track]]:origin-center
                  [&_[data-slot=slider-track]]:transition-transform
                  [&_[data-slot=slider-track]]:duration-150
                  [&_[data-slot=slider-track]]:group-hover/slider:scale-y-150
                "
                >
                  <Slider
                    className="w-full"
                    dir="ltr"
                    value={[isSeeking ? seekValue : videoTime]}
                    max={videoRef.current?.duration || 1}
                    onValueChange={(value) => {
                      setIsSeeking(true);
                      setSeekValue(value[0]);
                    }}
                    onValueCommit={(value) => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = value[0];
                        setVideoTime(value[0]);
                      }
                      setIsSeeking(false);
                    }}
                  />
                </div>
                <div className="w-full flex items-center justify-between">
                  <span className="text-white text-caption-md lg:text-body-xxs font-bold">{TimerParser(Number(videoSource.duration), true)}</span>
                  <span className="text-white text-caption-md lg:text-body-xxs font-bold">{TimerParser(Math.floor(videoTime), true)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default PlayerControlComp;
