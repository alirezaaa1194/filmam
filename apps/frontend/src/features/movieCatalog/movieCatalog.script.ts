import { infiniteQueryOptions } from "@tanstack/react-query";
import { AppApis } from "@/data";
import { AppLanguagesEnum, MovieListItemType, PaginationType } from "@/types";
import { ClientCall } from "@/scripts/client";

export const MOVIE_PAGE_SIZE = 20;

export type MovieFilters = {
  search?: string;
  section?: string;
  genres?: string[];
  countries?: string[];
  languages?: string[];
  tags?: string[];
  age_limits?: number[];
  type?: string;
  released_year_from?: number;
  released_year_to?: number;
  sort_by?: string;
  sort_order?: string;
  page?: number;
};

export function parseMovieFilters(params: URLSearchParams | { get(key: string): string | null; getAll(key: string): string[] }): MovieFilters {
  const stringList = (key: string) => params.getAll(key).filter(Boolean);
  const from = Number(params.get("released_year_from"));
  const to = Number(params.get("released_year_to"));
  const page = Number(params.get("page"));
  return {
    search: params.get("search") || undefined,
    section: params.get("section") || undefined,
    genres: stringList("genres").length ? stringList("genres") : undefined,
    countries: stringList("countries").length ? stringList("countries") : undefined,
    languages: stringList("languages").length ? stringList("languages") : undefined,
    tags: stringList("tags").length ? stringList("tags") : undefined,
    age_limits: stringList("age_limits").map(Number).filter(Number.isFinite).length ? stringList("age_limits").map(Number).filter(Number.isFinite) : undefined,
    type: params.get("type") || undefined,
    released_year_from: Number.isFinite(from) && params.get("released_year_from") ? from : undefined,
    released_year_to: Number.isFinite(to) && params.get("released_year_to") ? to : undefined,
    sort_by: params.get("sort_by") || undefined,
    sort_order: params.get("sort_order") || undefined,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export const movieCatalogInfiniteOptions = (locale: AppLanguagesEnum, filters: MovieFilters, fetcher: typeof ClientCall) =>
  infiniteQueryOptions({
    queryKey: ["movie-catalog", locale, filters],
    queryFn: ({ pageParam }) =>
      fetcher<PaginationType<MovieListItemType>>(AppApis.movie.all, {
        method: "GET",
        locale,
        query: { ...filters, page: pageParam, page_size: MOVIE_PAGE_SIZE },
      }),
    initialPageParam: filters.page || 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, page) => sum + page.data.length, 0);
      const nextPage = (filters.page || 1) + allPages.length;
      return loaded < lastPage.count ? nextPage : undefined;
    },
  });

