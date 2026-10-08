"use client";

import { Button } from "../../../../../utilities/components/ui";

export default function SkipIntroComp({ visible, introDuration, videoRef }: any) {
  if (!visible) return null;
  return (
    <Button
      className="bg-white text-black hover:bg-white/80 rounded-md cursor-pointer text-caption-md! font-bold! absolute bottom-28 lg:bottom-48 inset-e-5 lg:inset-e-12 z-10"
      onClick={() => {
        if (videoRef.current) videoRef.current.currentTime += introDuration;
      }}
    >
      رد کردن تیتراژ
    </Button>
  );
}
