"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useLocale } from "../../../../../hooks";
import { AppApis } from "../../../../../data";
import { ClientCall } from "../../../../../scripts/client";
import { PaginationType, SeasonEpisodeType, SortTypeEnum, UserMovieActionType, UserMovieTypeEnum } from "../../../../../types";

export function useEpisodesScript(movie: any, activeSeasonSlug: string, activeEpisodeId: number, open: boolean) {
  const { locale } = useLocale();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(activeSeasonSlug || movie.seasons?.[0]?.slug || "");
  const [sortValue] = useState<SortTypeEnum>(SortTypeEnum.ASC);
  const [unwatchedEpisodes] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setActiveTab(activeSeasonSlug || movie.seasons?.[0]?.slug || "");
  }, [open, activeSeasonSlug, movie.seasons]);

  const query = useInfiniteQuery({
    queryKey: ["player-episodes", activeTab, locale, sortValue, unwatchedEpisodes],
    queryFn: ({ pageParam = 1 }) =>
      ClientCall<PaginationType<SeasonEpisodeType>>(AppApis.season.episodesBySlug(activeTab), {
        method: "GET",
        locale,
        query: { page: pageParam, page_size: 10, sort: sortValue, unwatched_episodes: unwatchedEpisodes },
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
    if (!el || !query.hasNextPage || query.isFetchingNextPage || !open) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) query.fetchNextPage();
      },
      { threshold: 0.1, rootMargin: "100px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage, open]);

  const handleEpisodeClick = (episode: SeasonEpisodeType) => {
    router.push(`/player/episode/${episode.slug}?source=FILM`);
  };

  return { activeTab, setActiveTab, loadMoreRef, watchedIds, handleEpisodeClick, ...query };
}