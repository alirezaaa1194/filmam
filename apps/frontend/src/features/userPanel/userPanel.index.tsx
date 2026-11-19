"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useLocale } from "@/hooks";
import { FileTypeEnum, MovieTypeEnum, SectionUserMovieTypeEnum, UserMovieListItemType, UserMovieTypeEnum } from "@/types";
import MovieCardComp from "@/utilities/components/movie/movieCard/movieCard.index";
import RecentWatchItemComp from "@/features/home/sections/recentWatch/recentWatchItem/recentWatchItem.index";
import RecentWatchItemSkeletonComp from "@/features/home/sections/recentWatch/recentWatchItem/skeleton/recentWatchItemSkeleton.index";
import MovieCardSkeletonComp from "@/utilities/components/movie/movieCard/skeleton/movieCardSkeleton.index";
import { Button } from "@/utilities/components/ui/button/button.index";
import { USER_MOVIE_PAGE_SIZE, useUserMovieList } from "./userPanel.script";

function itemHref(item: UserMovieListItemType) {
  if (item.entity_type === SectionUserMovieTypeEnum.EPISODE && item.episode) return `/player/episode/${item.episode.slug}?source=FILM`;
  if (item.movie) return `/player/movie/${item.movie.slug || item.movie.id}?source=FILM`;
  return "/";
}

export default function UserPanelComp({ type, title }: { type: UserMovieTypeEnum; title: string }) {
  const { locale, dir, t } = useLocale();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const query = useUserMovieList(locale, type, true);
  const items = useMemo(() => query.data?.pages.flatMap((page) => page.data) ?? [], [query.data]);
  const isWatchTab = type === UserMovieTypeEnum.WATCHED || type === UserMovieTypeEnum.WATCHING;
  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element || !query.hasNextPage || query.isFetchingNextPage || query.isPending) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) void query.fetchNextPage(); }, { rootMargin: "500px 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [query.fetchNextPage, query.hasNextPage, query.isFetchingNextPage, query.isPending]);
  const skeletons = (count: number) => isWatchTab ? (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {Array.from({ length: count }, (_, i) => <RecentWatchItemSkeletonComp key={i} className="w-full" />)}
    </div>
  ) : (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
      {Array.from({ length: count }, (_, i) => <MovieCardSkeletonComp key={i} compact />)}
    </div>
  );

  return (
    <section dir={dir}>
      <h1 className="mb-5 text-h-5 font-bold">{title}</h1>
      {query.isPending ? skeletons(10) : null}
      {query.isError ? <div className="rounded-xl border border-gray-11 bg-gray-13 px-5 py-12 text-center"><p className="mb-4 text-body-xxs text-gray-7">{t("errors.unknown")}</p><Button variant="outline" onClick={() => void query.refetch()} className="h-10 cursor-pointer rounded-md border-gray-9 px-6 text-button-s text-white">{t("UserPanel.retry")}</Button></div> : null}
      {!query.isPending && !query.isError && items.length === 0 ? <div className="rounded-xl border border-gray-11 bg-gray-13 px-5 py-16 text-center text-body-xxs text-gray-7">{t("UserPanel.empty")}</div> : null}
      {!query.isPending && !query.isError && items.length > 0 ? isWatchTab ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {items.map((item) => <Link key={item.id} href={itemHref(item)} className="block min-w-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary"><RecentWatchItemComp movie={item} /></Link>)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
          {items.filter((item) => item.movie).map((item) => {
            const isLikedEpisode = type === UserMovieTypeEnum.LIKE && item.entity_type === SectionUserMovieTypeEnum.EPISODE && item.episode;
            const movieCard = isLikedEpisode ? {
              title: `${item.movie!.title} - ${t("RecentWatch.season")} ${item.episode!.season_order ?? 1} - ${t("RecentWatch.episode")} ${item.episode!.order}`,
              files: item.episode!.files,
              type: MovieTypeEnum.SERIES,
              likes_count: item.episode!.likes_count ?? 0,
              dislikes_count: item.episode!.dislikes_count ?? 0,
            } : item.movie!;
            const cardHref = isLikedEpisode ? itemHref(item) : `/movies/${item.movie!.slug || item.movie!.id}`;
            return <Link key={item.id} href={cardHref} className="block min-w-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary"><MovieCardComp movie={movieCard} compact titleClassName={isLikedEpisode ? "block min-w-0 max-w-full truncate" : ""} /></Link>;
          })}
        </div>
      ) : null}
      {!query.isPending && query.isFetchingNextPage ? <div className="mt-5">{skeletons(4)}</div> : null}
      {!query.isError ? <div ref={loadMoreRef} className="h-8" /> : null}
    </section>
  );
}
