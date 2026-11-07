import { dehydrate, HydrationBoundary, noop } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/getQueryClient";
import { GetLocale, ServerCall } from "@/scripts/server";
import { movieCatalogInfiniteOptions, parseMovieFilters } from "@/features/movieCatalog/movieCatalog.script";
import MovieCatalogComp from "@/features/movieCatalog/movieCatalog.index";
import type { Metadata } from "next";
import { GetTranslation } from "@/scripts/server/translation";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await GetTranslation();
  return {
    title: `${t("MovieCatalog.title")} | ${t("Common.filmam")}`,
    description: t("MovieCatalog.description"),
  };
}

type MoviePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MoviesPage({ searchParams }: MoviePageProps) {
  const [locale, params] = await Promise.all([GetLocale(), searchParams]);
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((item) => urlParams.append(key, item));
    else if (value) urlParams.set(key, value);
  });
  const filters = parseMovieFilters(urlParams);
  const queryClient = getQueryClient();
  await queryClient.infiniteQuery(movieCatalogInfiniteOptions(locale, filters, ServerCall)).catch(noop);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MovieCatalogComp initialFilters={filters} />
    </HydrationBoundary>
  );
}
