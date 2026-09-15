import { queryOptions } from "@tanstack/react-query";
import { AppApis } from "../../data";
import { AppLanguagesEnum, MovieDetailPublicType } from "../../types";
import { ClientCall } from "../../scripts/client";

export const movieDetailQueryOptions = (locale: AppLanguagesEnum, slug: string, fetcher: typeof ClientCall) =>
  queryOptions({
    queryKey: ["movie", slug, locale],

    queryFn: () =>
      fetcher<MovieDetailPublicType>(AppApis.movie.detail(slug), {
        method: "GET",
        locale,
      }),
  });
