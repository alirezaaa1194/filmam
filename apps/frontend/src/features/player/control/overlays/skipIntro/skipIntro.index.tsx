"use client";

import { Button } from "../../../../../utilities/components/ui";
import { useLocale } from "../../../../../hooks";

export default function SkipIntroComp({ visible, introDuration, videoRef }: any) {
  const { t } = useLocale();
  if (!visible) return null;
  return (
    <Button
      className="bg-white text-black hover:bg-white/80 rounded-md cursor-pointer text-caption-md! font-bold! absolute bottom-[24%] landscape:bottom-[30%] lg:bottom-[30%] inset-e-5 lg:inset-e-12 z-10"
      onClick={() => {
        if (videoRef.current) videoRef.current.currentTime += introDuration;
      }}
    >
      {t("Player.skipIntro")}
    </Button>
  );
}
