"use client";

import { Slider } from "../../../../../utilities/components/ui/slider";
import { TimerParser } from "../../../../../scripts";
import { useTimeline } from "./timeline.script";

type Props = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoTime: number;
  setVideoTime: (t: number) => void;
  duration: number;
  isSeeking: boolean;
  setIsSeeking: (v: boolean) => void;
};

export default function TimelineComp({ videoRef, videoTime, setVideoTime, duration }: Props) {
  const { isSeeking, seekValue, onValueChange, onValueCommit } = useTimeline(videoRef, setVideoTime);

  return (
    <div className="flex flex-col-reverse lg:flex-col gap-1.5 order-1 lg:order-2" data-player-control>
      <div className="group/slider [&_[data-slot=slider-thumb]]:opacity-0 [&_[data-slot=slider-thumb]]:transition-opacity [&_[data-slot=slider-thumb]]:duration-150 [&_[data-slot=slider-thumb]]:group-hover/slider:opacity-100 [&_[data-slot=slider-thumb]]:focus-visible:opacity-100 [&_[data-slot=slider-track]]:h-1 [&_[data-slot=slider-track]]:origin-center [&_[data-slot=slider-track]]:transition-transform [&_[data-slot=slider-track]]:duration-150 [&_[data-slot=slider-track]]:group-hover/slider:scale-y-150">
        <Slider className="w-full" dir="ltr" value={[isSeeking ? seekValue : videoTime]} max={duration || 1} onValueChange={onValueChange} onValueCommit={onValueCommit} />
      </div>
      <div className="w-full flex items-center justify-between">
        <span className="text-white text-caption-md lg:text-body-xxs font-bold">{TimerParser(Math.floor(duration), true)}</span>
        <span className="text-white text-caption-md lg:text-body-xxs font-bold">{TimerParser(Math.floor(videoTime), true)}</span>
      </div>
    </div>
  );
}
