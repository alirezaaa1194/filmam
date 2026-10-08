"use client";

import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useControlScript } from "./control.script";
import { useControlsVisibility } from "./hooks/useControlsVisibility";
import { useVolume } from "./hooks/useVolume";
import { useFullscreen } from "./hooks/useFullscreen";
import { usePip } from "./hooks/usePip";
import { usePlaybackRate } from "./hooks/usePlaybackRate";
import { useKeyboard } from "./hooks/useKeyboard";
import { useVideoClick } from "./hooks/useVideoClick";
import { PlayerControlProps, RippleType } from "./control.type";
import { useLocale } from "../../../hooks";
import TopBarComp from "./topBar/topBar.index";
import BottomBarComp from "./bottomBar/bottomBar.index";
import RippleComp from "./overlays/ripple/ripple.index";
import NextEpisodeComp from "./overlays/nextEpisode/nextEpisode.index";
import SkipIntroComp from "./overlays/skipIntro/skipIntro.index";
import BufferingComp from "./overlays/buffering/buffering.index";
import ResumeModalComp from "./modals/resume/resume.index";
import ErrorComp from "./error/error.index";

function PlayerControlComp(props: PlayerControlProps) {
  const { entityType, source, data } = props;
  const { dir } = useLocale();
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);

  const script = useControlScript({ entityType, data });
  const { videoRef, isPlaying, setIsPlaying, videoTime, setVideoTime, duration, setDuration, isBuffering, setIsBuffering, hasStarted, setHasStarted, error, setError, showResumeModal, setShowResumeModal, savedProgress, handleTimeUpdate, navigateToMovie } = script;

  const [ripple, setRipple] = useState<{ type: RippleType; id: number } | null>(null);
  const [isCover, setIsCover] = useState(false);
  const [autoNextEpisode, setAutoNextEpisode] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);

  const visibility = useControlsVisibility(isBuffering);
  const volume = useVolume(videoRef);
  const fullscreen = useFullscreen(mainRef);
  const pip = usePip(videoRef);
  const playback = usePlaybackRate(videoRef);

  const videoSource = data.files.find((f) => f.type === source.toUpperCase());

  const showRipple = useCallback((type: RippleType) => {
    setRipple({ type, id: Date.now() });
    setTimeout(() => setRipple(null), 600);
  }, []);

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      showRipple("play");
    } else {
      video.pause();
      showRipple("pause");
    }
  }, [videoRef, showRipple]);

  const seekBy = useCallback(
    (seconds: number) => {
      const video = videoRef.current;
      if (!video) return;
      if (seconds > 0) {
        video.currentTime = Math.min(video.currentTime + seconds, video.duration);
        showRipple("forward");
      } else {
        video.currentTime = Math.max(video.currentTime + seconds, 0);
        showRipple("backward");
      }
    },
    [videoRef, showRipple],
  );

  useKeyboard({
    onPlayPause: handlePlayPause,
    onSeek: seekBy,
    onToggleMute: volume.toggleMute,
    onVolumeUp: volume.increaseVolume,
    onVolumeDown: volume.decreaseVolume,
  });

  const { handleVideoClick } = useVideoClick({
    onPlayPause: handlePlayPause,
    onSeek: seekBy,
    showControl: visibility.showControl,
    setShowControl: visibility.setShowControl,
  });

  visibility.setVideoRefForCheck(videoRef.current);

  if (!videoSource || error) {
    return <ErrorComp entityType={entityType} data={data} dir={dir} setError={setError} />;
  }

  return (
    <main className="h-[100svh] w-full overflow-hidden bg-gray-13">
      <ResumeModalComp open={showResumeModal} setOpen={setShowResumeModal} savedProgress={savedProgress} data={data} entityType={entityType} dir={dir} videoRef={videoRef} />

      <div ref={mainRef} className="relative select-none w-full h-[100svh]" onMouseEnter={visibility.handleMouseEnter} onMouseLeave={visibility.handleMouseLeave} onMouseMove={visibility.handleMouseMove} onClick={handleVideoClick}>
        {isBuffering ? <BufferingComp /> : null}

        <video
          src={videoSource.path}
          className={`w-full h-full bg-gray-13 ${isCover ? "object-cover" : "object-contain"}`}
          ref={videoRef}
          onPlay={() => {
            setIsPlaying(true);
            setHasStarted(true);
          }}
          onPause={() => setIsPlaying(false)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onTimeUpdate={handleTimeUpdate}
          onWaiting={() => hasStarted && setIsBuffering(true)}
          onCanPlay={() => hasStarted && setIsBuffering(false)}
          onPlaying={() => hasStarted && setIsBuffering(false)}
          onSeeking={() => hasStarted && setIsBuffering(true)}
          onSeeked={() => hasStarted && setIsBuffering(false)}
          onError={() => {
            if (!error) setError(true);
          }}
        />

        <NextEpisodeComp visible={videoTime >= Number(videoSource.duration) - Number(videoSource.outro_duration) && entityType === "EPISODE" && !!(data as any).next_episode && autoNextEpisode} videoSource={videoSource} data={data} autoNextEpisode={autoNextEpisode} setAutoNextEpisode={setAutoNextEpisode} />
        <SkipIntroComp visible={videoTime >= Number(videoSource.intro_start_time) && videoTime <= Number(videoSource.intro_start_time) + Number(videoSource.intro_duration)} introDuration={Number(videoSource.intro_duration)} videoRef={videoRef} />
        <RippleComp ripple={ripple} />
        <div className={`w-full h-full absolute top-0 right-0 flex flex-col justify-between transition-all duration-300 ${visibility.showControl ? "opacity-100 visible" : "opacity-0 invisible"}`}>
          <TopBarComp entityType={entityType} source={source} data={data} dir={dir} onBack={navigateToMovie} videoRef={videoRef} />
          <BottomBarComp entityType={entityType} source={source} data={data} videoRef={videoRef} videoSource={videoSource} isPlaying={isPlaying} videoTime={videoTime} setVideoTime={setVideoTime} duration={duration} isBuffering={isBuffering} isSeeking={isSeeking} setIsSeeking={setIsSeeking} handlePlayPause={handlePlayPause} seekBy={seekBy} volume={volume} fullscreen={fullscreen} pip={pip} playback={playback} isCover={isCover} setIsCover={setIsCover} setAutoNextEpisode={setAutoNextEpisode} router={router} />
        </div>
      </div>
    </main>
  );
}

export default PlayerControlComp;
