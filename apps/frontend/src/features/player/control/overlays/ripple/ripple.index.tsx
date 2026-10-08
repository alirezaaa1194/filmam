import { Backward10Seconds, Forward10Seconds, Pause, Play } from "iconsax-react";
import { RippleType } from "../../control.type";

export default function RippleComp({ ripple }: { ripple: { type: RippleType; id: number } | null }) {
  if (!ripple) return null;
  return (
    <div key={ripple.id} className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
      <div className="size-14 lg:size-20 rounded-full bg-black/60 backdrop-blur-[20px] flex items-center justify-center animate-[ripple_600ms_ease-out_forwards]">
        {ripple.type === "play" && <Play className="size-6 lg:size-10 fill-white" />}
        {ripple.type === "pause" && <Pause className="size-6 lg:size-10 fill-white" />}
        {ripple.type === "forward" && <Forward10Seconds className="size-6 lg:size-10 stroke-white" />}
        {ripple.type === "backward" && <Backward10Seconds className="size-6 lg:size-10 stroke-white" />}
      </div>
    </div>
  );
}
