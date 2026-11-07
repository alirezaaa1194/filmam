"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useLocale, useMediaQuery } from "@/hooks";
import { ClientCall } from "@/scripts/client";
import { MovieListItemType } from "@/types";
import MovieCardComp from "@/utilities/components/movie/movieCard/movieCard.index";
import MovieCardSkeletonComp from "@/utilities/components/movie/movieCard/skeleton/movieCardSkeleton.index";
import { Button } from "@/utilities/components/ui";
import { MovieFilters, MOVIE_PAGE_SIZE, movieCatalogInfiniteOptions, parseMovieFilters } from "./movieCatalog.script";
import MovieFiltersPanel from "./movieFiltersPanel/movieFiltersPanel.index";

export default function MovieCatalogComp({ initialFilters }: { initialFilters: MovieFilters }) {
  const { locale, t, dir } = useLocale();
  const isMobile = useMediaQuery("(max-width: 1199px)");
  const [draftFilters, setDraftFilters] = useState<MovieFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<MovieFilters>(initialFilters);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const query = useInfiniteQuery(movieCatalogInfiniteOptions(locale, appliedFilters, ClientCall));
  const movies = useMemo(() => query.data?.pages.flatMap((page) => page.data) ?? [], [query.data]);

  useEffect(() => {
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
  }, [initialFilters]);
  useEffect(() => {
    const syncFromUrl = () => {
      const next = parseMovieFilters(new URLSearchParams(window.location.search));
      setDraftFilters(next);
      setAppliedFilters(next);
    };
    window.addEventListener("popstate", syncFromUrl);
    window.addEventListener("movie-catalog-url-change", syncFromUrl);
    return () => {
      window.removeEventListener("popstate", syncFromUrl);
      window.removeEventListener("movie-catalog-url-change", syncFromUrl);
    };
  }, []);
  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element || !query.hasNextPage || query.isFetchingNextPage) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) void query.fetchNextPage(); }, { rootMargin: "600px 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  const applyFilters = (nextFilters = draftFilters) => {
    const params = new URLSearchParams({ lang: locale, page: "1", page_size: String(MOVIE_PAGE_SIZE) });
    Object.entries({ ...nextFilters, page: undefined }).forEach(([key, value]) => {
      if (value === undefined || value === "") return;
      if (Array.isArray(value)) value.forEach((item) => params.append(key, String(item)));
      else params.set(key, String(value));
    });
    const next = { ...nextFilters, page: 1 };
    setAppliedFilters(next);
    setDraftFilters(next);
    window.history.pushState(null, "", `/movies?${params.toString()}`);
  };
  const commitYear = (nextFilters: MovieFilters) => {
    setDraftFilters(nextFilters);
  };

  return (
    <main dir={dir} className="min-h-screen px-layout-x-space pb-16 pt-[104px] lg:pt-[152px]">
      <div className="mx-auto w-full max-w-layout-max">
        <h1 className="mb-4 block text-right text-h-5 font-bold text-white">{t("MovieCatalog.title")}</h1>
        <section className="mb-6 select-none rounded-lg bg-gray-12 p-3 sm:p-4" aria-label={t("MovieCatalog.filters")}>
          <MovieFiltersPanel filters={draftFilters} onChange={setDraftFilters} onApply={() => applyFilters()} onYearCommit={commitYear} mobile={isMobile} />
        </section>

        {query.isError ? <div className="rounded-xl border border-gray-10 py-16 text-center"><p className="mb-4 text-sm text-gray-7">{t("errors.unknown")}</p><Button onClick={() => void query.refetch()}>{t("MovieCatalog.retry")}</Button></div> : null}
        {!query.isError && movies.length === 0 && !query.isPending ? <div className="py-20 text-center text-gray-7">{t("MovieCatalog.noResults")}</div> : null}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:grid-cols-5 lg:gap-6">
          {movies.map((movie: MovieListItemType) => <Link href={`/movies/${movie.slug}`} key={movie.id} className="block min-w-0"><MovieCardComp movie={movie} compact /></Link>)}
          {(query.isPending || query.isFetchingNextPage) && Array.from({ length: MOVIE_PAGE_SIZE }).map((_, index) => <MovieCardSkeletonComp key={`skeleton-${index}`} compact />)}
        </div>
        {!query.isError ? <div ref={loadMoreRef} className="h-10" /> : null}
      </div>
    </main>
  );
}
