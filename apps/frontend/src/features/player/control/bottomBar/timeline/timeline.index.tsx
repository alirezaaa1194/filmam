"use client";

import { Slider } from "../../../../../utilities/components/ui/slider";
import { TimerParser } from "../../../../../scripts";
import { useTimeline } from "./timeline.script";
import { TimelinePropsType } from "./timeline.type";

export default function TimelineComp({ videoRef, videoTime, setVideoTime, duration }: TimelinePropsType) {
  const { isSeeking, seekValue, onValueChange, onValueCommit } = useTimeline(videoRef, setVideoTime);
  const safeDuration = Number.isFinite(Number(duration)) && Number(duration) > 0 ? Number(duration) : 1;

  return (
    <div className="flex flex-col-reverse lg:flex-col gap-1.5 order-1 lg:order-2" data-player-control>
      <div className="group/slider ...">
        <Slider className="w-full" dir="ltr" value={[isSeeking ? seekValue : videoTime]} max={safeDuration} onValueChange={onValueChange} onValueCommit={onValueCommit} />
      </div>
      <div className="w-full flex items-center justify-between">
        <span className="text-white text-caption-md lg:text-body-xxs font-bold">{TimerParser(Math.floor(safeDuration), true)}</span>
        <span className="text-white text-caption-md lg:text-body-xxs font-bold">{TimerParser(Math.floor(videoTime), true)}</span>
      </div>
    </div>
  );
}
