import { useInfiniteQuery } from "@tanstack/react-query";
import { AppApis } from "@/data";
import { ClientCall } from "@/scripts/client";
import { AppLanguagesEnum, PaginationType, UserMovieListItemType, UserMovieTypeEnum } from "@/types";

export const USER_MOVIE_PAGE_SIZE = 20;

export function useUserMovieList(locale: AppLanguagesEnum, type: UserMovieTypeEnum, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: ["user-movies", type, locale],
    enabled,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      ClientCall<PaginationType<UserMovieListItemType>>(AppApis.userMovie.all, {
        method: "GET",
        locale,
        query: { type: [type], page: pageParam, page_size: USER_MOVIE_PAGE_SIZE },
      }),
    getNextPageParam: (lastPage, pages) => {
      const loadedCount = pages.reduce((total, page) => total + page.data.length, 0);
      return loadedCount < lastPage.count ? pages.length + 1 : undefined;
    },
  });
}
