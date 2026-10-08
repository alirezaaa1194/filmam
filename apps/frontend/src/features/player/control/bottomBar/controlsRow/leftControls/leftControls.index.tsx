"use client";

import { ArrowLeft2, Crop, Maximize2, Maximize3, Next } from "iconsax-react";
import { Minimize, PictureInPicture2 } from "lucide-react";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../../../utilities/components/ui";
import { CommentEntityTypeEnum, FileTypeEnum } from "../../../../../../types";
import PlayerEpisodesModalComp from "../../../modals/episodes/episodes.index";
import { useOpenControl } from "./leftControls.script";

export default function LeftControlsComp(props: any) {
  const { entityType, source, data, videoRef, fullscreen, pip, playback, isCover, setIsCover, setAutoNextEpisode, router } = props;
  const { openControl, setOpenControl } = useOpenControl();

  const handleNextEpisode = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    if (!data.next_episode?.slug) return;
    setAutoNextEpisode(true);
    router.push(`/player/episode/${data.next_episode.slug}?source=FILM`);
  };

  return (
    <div className="flex items-center bg-gray-14 lg:bg-transparent rounded-full px-2 py-1 min-w-0">
      <div
        data-player-control
        className={`
          overflow-hidden transition-[max-width,opacity] duration-300 ease-in-out min-w-0
          ${openControl ? "max-w-[calc(100vw-160px)] opacity-100 overflow-x-auto scrollbar-none" : "max-w-[calc(100vw-260px)] opacity-100 overflow-hidden"}
          max-lg:landscape:max-w-full max-lg:landscape:overflow-x-auto max-lg:landscape:scrollbar-none
          lg:max-w-full lg:overflow-visible
        `}
      >
        <div className="flex items-center gap-2 lg:gap-4 w-max">
          <Button onClick={fullscreen.toggleFullscreen} className="size-11 lg:size-12 shrink-0 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer hover:shadow-[0_0_3px_var(--color-gray-12)]">
            {fullscreen.isFullscreen ? <Minimize className="size-5 stroke-white" /> : <Maximize2 className="size-5 stroke-white" />}
          </Button>

          <Button onClick={() => setIsCover((v: boolean) => !v)} className="size-11 lg:size-12 shrink-0 rounded-full backdrop-blur-[20px] cursor-pointer hover:shadow-[0_0_3px_var(--color-gray-12)] hidden lg:flex landscape:flex bg-gray-14/50 hover:bg-gray-14">
            {isCover ? <Crop className="size-5 stroke-white" /> : <Maximize3 className="size-5 stroke-white" />}
          </Button>

          <Button onClick={pip.togglePip} className="size-11 lg:size-12 shrink-0 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer hover:shadow-[0_0_3px_var(--color-gray-12)]">
            <PictureInPicture2 className="size-5 stroke-white" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="size-11 lg:size-12 shrink-0 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer hover:shadow-[0_0_3px_var(--color-gray-12)]">
                <span className="text-white text-xs font-bold">{playback.playbackRate}x</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="top" className="bg-gray-14/90 backdrop-blur-[20px] border-white/20">
              {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                <DropdownMenuItem key={rate} onClick={() => playback.changeSpeed(rate)} className="text-white cursor-pointer justify-center">
                  {rate}x
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {entityType === CommentEntityTypeEnum.EPISODE && data.next_episode ? (
            <Button onClick={handleNextEpisode} className="size-11 lg:size-12 shrink-0 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer hover:shadow-[0_0_3px_var(--color-gray-12)]">
              <Next className="size-5 stroke-white" />
            </Button>
          ) : null}

          {entityType === CommentEntityTypeEnum.EPISODE && source === FileTypeEnum.FILM ? <PlayerEpisodesModalComp movie={data.movie} activeEpisodeId={data.id} activeSeasonSlug={data.season.slug} /> : null}
        </div>
      </div>

      <span className="w-px h-4 bg-gray-11 shrink-0 transition-all duration-300 mx-2 max-lg:landscape:hidden lg:hidden" />

      <Button onClick={() => setOpenControl((v) => !v)} className="size-7 shrink-0 bg-transparent! cursor-pointer flex max-lg:landscape:hidden lg:hidden">
        <ArrowLeft2 className={`size-5 stroke-white transition-transform duration-300 ${openControl ? "rotate-180" : ""}`} />
      </Button>
    </div>
  );
}
