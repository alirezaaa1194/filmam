"use client";

import TitleComp from "./title/title.index";
import ControlsRowComp from "./controlsRow/controlsRow.index";
import TimelineComp from "./timeline/timeline.index";

type Props = any;

export default function BottomBarComp(props: Props) {
  return (
    <div className="w-full pb-4 px-3 lg:p-10 flex flex-col gap-3 lg:gap-6 bg-gradient-to-t from-black/75 to-transparent">
      <TitleComp entityType={props.entityType} data={props.data} />
      <div className="w-full flex flex-col gap-3 lg:gap-7">
        <ControlsRowComp {...props} />
        <TimelineComp videoRef={props.videoRef} videoTime={props.videoTime} setVideoTime={props.setVideoTime} duration={props.duration} isSeeking={props.isSeeking} setIsSeeking={props.setIsSeeking} />
      </div>
    </div>
  );
}
