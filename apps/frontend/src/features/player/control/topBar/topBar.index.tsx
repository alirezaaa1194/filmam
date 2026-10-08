"use client";

import { ArrowRight2 } from "iconsax-react";
import { Button } from "@/utilities/components/ui";
import { CommentEntityTypeEnum, FileTypeEnum } from "@/types";
import PlayerUserActionsComp from "../userActions/userActions.index";
import Link from "next/link";

type Props = {
  entityType: CommentEntityTypeEnum;
  source: FileTypeEnum.FILM | FileTypeEnum.TRAILER;
  data: any;
  dir: string;
  slug: string;
  videoRef: React.RefObject<HTMLVideoElement | null>;
};

export default function TopBarComp({ entityType, source, data, dir, slug, videoRef }: Props) {
  const handleBack = async () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      // video.removeAttribute("src");
      video.load();
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
      // @ts-ignore
      screen.orientation?.unlock?.();
    }
  };

  return (
    <div className="w-full flex items-center justify-between pt-4 px-3 lg:p-10">
      <Link href={`/movies/${slug}`}>
        <Button className="h-11 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer flex gap-2 border border-white/50 hover:border-white px-6" onClick={handleBack}>
          <ArrowRight2 className={`size-5 stroke-white ${dir === "ltr" ? "rotate-180" : ""}`} />
          <span className="text-white text-caption-md lg:text-body-xxs font-bold">بازگشت</span>
        </Button>
      </Link>
      {source === FileTypeEnum.FILM ? <PlayerUserActionsComp entityType={entityType} entityId={data.id} /> : null}
    </div>
  );
}
