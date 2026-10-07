"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "iconsax-react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks";
import { MovieDetailPublicType, PaginationType, SeasonEpisodeType, SortTypeEnum, UserMovieActionType, UserMovieTypeEnum } from "@/types";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Spinner } from "@/utilities/components/ui";
import { Tabs, TabsList, TabsTrigger } from "@/utilities/components/ui/tabs";
import { AppApis } from "@/data";
import { ClientCall } from "@/scripts/client";

type PlayerEpisodesModalProps = {
  movie: MovieDetailPublicType;
  activeEpisodeId: number;
  activeSeasonSlug: string;
  onOpenChange?: (open: boolean) => void;
};

export default function PlayerEpisodesModalComp({ movie, activeEpisodeId, activeSeasonSlug, onOpenChange }: PlayerEpisodesModalProps) {
  const { locale, dir } = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(activeSeasonSlug || movie.seasons?.[0]?.slug || "");
  const [sortValue] = useState<SortTypeEnum>(SortTypeEnum.ASC);
  const [unwatchedEpisodes] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setActiveTab(activeSeasonSlug || movie.seasons?.[0]?.slug || "");
    }
  }, [open, activeSeasonSlug, movie.seasons]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["player-episodes", activeTab, locale, sortValue, unwatchedEpisodes],
    queryFn: ({ pageParam = 1 }) =>
      ClientCall<PaginationType<SeasonEpisodeType>>(AppApis.season.episodesBySlug(activeTab), {
        method: "GET",
        locale,
        query: {
          page: pageParam,
          page_size: 10,
          sort: sortValue,
          unwatched_episodes: unwatchedEpisodes,
        },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages) => {
      const loadedCount = allPages.reduce((sum, page: any) => sum + (page.data?.length ?? 0), 0);
      return loadedCount < lastPage.count ? lastPage.page + 1 : undefined;
    },
    enabled: !!activeTab && open,
  });

  const { data: userMovies } = useQuery({
    queryKey: ["user-movie-actions", movie.id],
    queryFn: () =>
      ClientCall<UserMovieActionType[]>(AppApis.userMovie.movieActions(movie.id), {
        method: "GET",
        locale,
        query: { entity_type: "MOVIE" },
      }),
    enabled: open,
  });

  const watchedIds = new Set(userMovies?.filter((a) => a.type === UserMovieTypeEnum.WATCHED).map((a) => a.movie_id));

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !hasNextPage || isFetchingNextPage || !open) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, open]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  const handleEpisodeClick = (episode: SeasonEpisodeType) => {
    handleOpenChange(false);
    router.push(`/player/episode/${episode.slug}?source=FILM`);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="size-12 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer hover:shadow-[0_0_3px_var(--color-gray-12)]">
          <Play className="size-5 fill-white" />
        </Button>
      </DialogTrigger>

      <DialogContent showHeader={false} className="bg-gray-14/95 backdrop-blur-[20px] border-white/20 text-white max-w-3xl p-0 max-h-[80dvh] flex flex-col" dir={dir}>
        <DialogHeader className="p-6 pb-4 border-b border-white/10">
          <DialogTitle className="text-white">قسمت‌های {movie.title}</DialogTitle>
        </DialogHeader>

        {movie.seasons && movie.seasons.length > 0 ? (
          <div className="px-6 py-2 overflow-x-auto overflow-y-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-max">
              <TabsList className="flex flex-nowrap justify-start gap-2 h-max! bg-transparent w-max">
                {movie.seasons.map((season) => (
                  <TabsTrigger key={season.id} value={season.slug} className={`flex-none px-4 h-9 rounded-md bg-transparent border border-gray-9 text-gray-9! text-button-s cursor-pointer transition-all ${activeTab === season.slug ? "border-primary bg-primary hover:bg-primary/80 text-white!" : "hover:border-primary hover:text-primary!"}`}>
                    فصل {season.order}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading || !data ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="size-8 text-primary" />
            </div>
          ) : data.pages[0]?.count ? (
            <div className="flex flex-col gap-2">
              {data.pages.map((page) =>
                page.data.map((episode) => {
                  const isActive = episode.id === activeEpisodeId;
                  const isWatched = watchedIds.has(episode.id);

                  return (
                    <button key={episode.id} onClick={() => handleEpisodeClick(episode)} className={`w-full flex items-center justify-between gap-4 p-3 rounded-md text-right transition-all cursor-pointer ${isActive ? "bg-primary/20 border border-primary" : "bg-white/5 hover:bg-white/10 border border-transparent"}`}>
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${isActive ? "bg-primary" : "bg-white/10"}`}>{isActive ? <Play className="size-4 fill-white" /> : <span className="text-white text-body-xxs font-bold">{episode.order}</span>}</div>
                        <div className="flex flex-col gap-1">
                          <span className="text-white text-body-xxs font-bold">
                            قسمت {episode.order}
                            {episode.title ? ` - ${episode.title}` : ""}
                          </span>
                          {isWatched ? <span className="text-primary text-caption-md">دیده‌شده</span> : null}
                        </div>
                      </div>
                      {isActive ? <span className="text-primary text-caption-md font-bold">در حال پخش</span> : null}
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
