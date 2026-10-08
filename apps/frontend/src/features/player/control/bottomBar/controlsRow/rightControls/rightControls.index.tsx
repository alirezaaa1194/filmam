"use client";

import { Backward, Backward10Seconds, Forward10Seconds, Pause, Play, VolumeCross, VolumeHigh } from "iconsax-react";
import { Button } from "../../../../../../utilities/components/ui";
import { Slider } from "../../../../../../utilities/components/ui/slider";

export default function RightControlsComp(props: any) {
  const { isPlaying, isBuffering, handlePlayPause, seekBy, volume, videoRef } = props;

  return (
    <div className="flex items-center gap-2 lg:gap-4 min-w-0 shrink-0" data-player-control>
      <div className="h-11 lg:h-12 hover:w-40 w-11 lg:w-12 transition-all flex items-center justify-end bg-gray-14 lg:bg-transparent lg:hover:bg-gray-14 rounded-full overflow-hidden group/volume">
        <div className="px-3 flex-1 min-w-0">
          <Slider
            dir="ltr"
            className="group/slider [&_[data-slot=slider-thumb]]:opacity-0 [&_[data-slot=slider-thumb]]:transition-opacity [&_[data-slot=slider-thumb]]:duration-150 [&_[data-slot=slider-thumb]]:group-hover/slider:opacity-100 [&_[data-slot=slider-thumb]]:focus-visible:opacity-100"
            value={[volume.isMuted ? 0 : volume.volume]}
            max={1}
            step={0.01}
            onValueChange={(value) => volume.changeVolume(value[0])}
          />
        </div>
        <Button onClick={volume.toggleMute} className="size-11 lg:size-12 shrink-0 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer hover:shadow-[0_0_3px_var(--color-gray-12)]">
          {volume.isMuted || volume.volume === 0 ? <VolumeCross className="size-5 stroke-white" /> : <VolumeHigh className="size-5 stroke-white" />}
        </Button>
      </div>

      <Button onClick={handlePlayPause} disabled={isBuffering} className="size-11 shrink-0 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer hover:shadow-[0_0_3px_var(--color-gray-12)] disabled:opacity-100 flex lg:hidden">
        {!isPlaying || isBuffering ? <Play className="size-5 fill-white" /> : <Pause className="size-5 fill-white" />}
      </Button>

      <Button
        onClick={() => {
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            props.setAutoNextEpisode(true);
          }
        }}
        className="size-12 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer hover:shadow-[0_0_3px_var(--color-gray-12)] hidden lg:flex"
      >
        <Backward className="size-5 stroke-white" />
      </Button>
      <Button onClick={() => seekBy(10)} className="size-12 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer hover:shadow-[0_0_3px_var(--color-gray-12)] hidden lg:flex">
        <Forward10Seconds className="size-5 stroke-white" />
      </Button>
      <Button onClick={() => seekBy(-10)} className="size-12 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer hover:shadow-[0_0_3px_var(--color-gray-12)] hidden lg:flex">
        <Backward10Seconds className="size-5 stroke-white" />
      </Button>
      <Button onClick={handlePlayPause} disabled={isBuffering} className="size-12 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer hover:shadow-[0_0_3px_var(--color-gray-12)] disabled:opacity-100 hidden lg:flex">
        {!isPlaying || isBuffering ? <Play className="size-5 fill-white" /> : <Pause className="size-5 fill-white" />}
      </Button>
    </div>
  );
}