"use client";

import LeftControlsComp from "./leftControls/leftControls.index";
import RightControlsComp from "./rightControls/rightControls.index";

export default function ControlsRowComp(props: any) {
  return (
    <div className="flex items-center justify-between order-2 lg:order-1 gap-2">
      <LeftControlsComp {...props} />
      <RightControlsComp {...props} />
    </div>
  );
}
