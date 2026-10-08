"use client";

import { X } from "lucide-react";
import { Button } from "../../../../../utilities/components/ui";
import { useRouter } from "next/navigation";

export default function NextEpisodeComp({ visible, videoSource, data, autoNextEpisode, setAutoNextEpisode }: any) {
  const router = useRouter();
  if (!visible) return null;

  const goNext = () => {
    if (!autoNextEpisode) return;
    if (!data.next_episode?.slug) return;
    router.push(`/player/episode/${data.next_episode.slug}?source=FILM`);
  };

  return (
    <div className="flex items-center gap-2 absolute bottom-40 lg:bottom-60 inset-s-5 lg:inset-s-12 z-10">
      <Button
        className="bg-gray-14/50! backdrop-blur-[20px] rounded-md cursor-pointer text-body-xs! font-bold! px-4 h-10 relative"
        onClick={goNext}
      >
        <span className="block absolute top-0 inset-s-0 -z-[1] h-full rounded-md bg-gray-14 w-full animate-shrink" onAnimationEnd={goNext} />
        قسمت بعدی
      </Button>
      <Button className="bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] rounded-md cursor-pointer text-caption-md! font-bold! h-10" onClick={() => setAutoNextEpisode(false)}>
        <X />
      </Button>
    </div>
  );
}