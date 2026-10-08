"use client";

import { Category, Play } from "iconsax-react";
import { X } from "lucide-react";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Spinner } from "../../../../../utilities/components/ui";
import { Tabs, TabsList, TabsTrigger } from "../../../../../utilities/components/ui/tabs";
import { FileTypeEnum } from "../../../../../types";
import { useLocale } from "../../../../../hooks";
import { useState } from "react";
import { useEpisodesScript } from "./episodes.script";
import { PlayerEpisodesModalProps } from "./episodes.type";


export default function PlayerEpisodesModalComp({ movie, activeEpisodeId, activeSeasonSlug, onOpenChange }: PlayerEpisodesModalProps) {
  const { dir } = useLocale();
  const [open, setOpen] = useState(false);
  const { activeTab, setActiveTab, loadMoreRef, watchedIds, handleEpisodeClick, data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useEpisodesScript(movie, activeSeasonSlug, activeEpisodeId, open);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="size-11 lg:size-12 shrink-0 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer hover:shadow-[0_0_3px_var(--color-gray-12)]">
          <Category className="size-5 stroke-white" />
        </Button>
      </DialogTrigger>

      <DialogContent showHeader={false} className="bg-gray-14/95 backdrop-blur-[20px] border-white/20 text-white p-0 flex flex-col w-screen h-[100svh] max-w-none rounded-none left-0 top-0 translate-x-0 translate-y-0 sm:w-auto sm:h-auto sm:max-w-3xl sm:max-h-[80dvh] sm:rounded-lg sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2" dir={dir}>
        <DialogHeader className="p-6 pb-4 border-b border-white/10 flex flex-row items-center justify-between">
          <DialogTitle className="text-white">قسمت‌های {movie.title}</DialogTitle>
          <Button className="size-11 lg:size-12 shrink-0 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer" onClick={() => setOpen(false)}>
            <X className="size-5 fill-white" />
          </Button>
        </DialogHeader>

        {movie.seasons && movie.seasons.length > 0 ? (
          <div className="px-6 py-2 overflow-x-auto overflow-y-hidden scrollbar-none">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-max">
              <TabsList className="flex flex-nowrap justify-start gap-2 h-max! bg-transparent w-max">
                {movie.seasons.map((season: any) => (
                  <TabsTrigger key={season.id} value={season.slug} className={`flex-none px-4 h-9 rounded-md bg-transparent border border-gray-9 text-gray-9! text-button-s cursor-pointer transition-all ${activeTab === season.slug ? "border-primary bg-primary text-white!" : "hover:border-primary hover:text-primary!"}`}>
                    فصل {season.order}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-none">
          {isLoading || !data ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="size-8 text-primary" />
            </div>
          ) : data.pages[0]?.count ? (
            <div className="flex flex-col gap-2">
              {data.pages.map((page: any) =>
                page.data.map((episode: any) => {
                  const isActive = episode.id === activeEpisodeId;
                  const isWatched = watchedIds.has(episode.id);
                  const episodeCover = episode.files?.find((file: any) => file.type === FileTypeEnum.COVER);

                  return (
                    <button
                      key={episode.id}
                      onClick={() => {
                        handleOpenChange(false);
                        handleEpisodeClick(episode);
                      }}
                      className={`w-full flex items-center gap-3 p-2 sm:p-3 rounded-md text-right transition-all cursor-pointer ${isActive ? "bg-primary/20 border border-primary" : "bg-white/5 hover:bg-white/10 border border-transparent"}`}
                    >
                      {episodeCover?.path ? (
                        <div className="relative size-16 sm:size-10 shrink-0 rounded-md overflow-hidden bg-white/10">
                          <img src={episodeCover.path} alt={`قسمت ${episode.order}`} className="w-full h-full object-cover" />
                          {isActive ? (
                            <div className="absolute inset-0 bg-primary/50 flex items-center justify-center">
                              <Play className="size-5 fill-white" />
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${isActive ? "bg-primary" : "bg-white/10"}`}>{isActive ? <Play className="size-4 fill-white" /> : <span className="text-white text-body-xxs font-bold">{episode.order}</span>}</div>
                      )}

                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <span className="text-white text-body-xxs font-bold truncate">
                          قسمت {episode.order}
                          {episode.title ? ` - ${episode.title}` : ""}
                        </span>
                        {isWatched ? <span className="text-primary text-caption-md">دیده‌شده</span> : null}
                      </div>

                      {isActive ? <span className="text-primary text-caption-md font-bold shrink-0 hidden sm:block">در حال پخش</span> : null}
                    </button>
                  );
                }),
              )}

              <div ref={loadMoreRef} className="h-4" />

              {isFetchingNextPage ? (
                <div className="flex justify-center py-4">
                  <Spinner className="size-6 text-primary" />
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-center text-gray-8 text-body-xxs py-12">قسمتی برای این فصل وجود ندارد</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
