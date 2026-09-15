import { infiniteQueryOptions } from "@tanstack/react-query";
import { AppApis } from "../../data";
import { AppLanguagesEnum, PaginationType, SectionType } from "../../types";
import { ClientCall } from "../../scripts/client";

export const sectionsInfiniteOptions = (locale: AppLanguagesEnum, fetcher: typeof ClientCall) =>
  infiniteQueryOptions({
    queryKey: ["sections", locale],
    queryFn: ({ pageParam }) =>
      fetcher<PaginationType<SectionType>>(AppApis.section.publicAll, {
        method: "GET",
        locale,
        query: {
          page: pageParam,
          page_size: 10,
        },
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage: any, allPages) => {
      const loaded = allPages.length * lastPage.page_size;

      return loaded < lastPage.count ? allPages.length + 1 : undefined;
    },
  });
