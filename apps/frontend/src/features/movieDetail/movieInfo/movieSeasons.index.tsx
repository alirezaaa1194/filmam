import { ArrowDown2 } from "iconsax-react";
import { MovieDetailPublicType, PaginationType, SeasonEpisodeType, SortTypeEnum } from "../../../types";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Spinner } from "../../../utilities/components/ui";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocale } from "../../../hooks";
import { Tabs, TabsList, TabsTrigger } from "../../../utilities/components/ui/tabs";
import { ClientCall } from "../../../scripts/client";
import { AppApis } from "../../../data";
import SeasonEpisodesComp from "./episodes/episodes.index";
import EpisodeCardSkeletonComp from "./episodes/episodeCard/skeleton/episodeCardSkeleton.index";

function MovieSeasonsComp({ movie }: { movie: MovieDetailPublicType }) {
  if (!movie.seasons?.length) {
    return (
      <section className="flex flex-col gap-4 lg:gap-8 px-layout-x-space mt-16">
        <p className="text-center text-gray-9">این سریال قسمتی ندارد</p>
      </section>
    );
  }

  const [open, setOpen] = useState(false);
  const { locale, t } = useLocale();
  const [sortValue, setSortValue] = useState<SortTypeEnum>(SortTypeEnum.ASC);
  const [activeTab, setActiveTab] = useState<string>(movie.seasons?.[0]?.slug!);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useInfiniteQuery({
    queryKey: ["episodes", activeTab, locale, sortValue],
    queryFn: ({ pageParam = 1 }) =>
      ClientCall<PaginationType<SeasonEpisodeType>>(AppApis.season.episodesBySlug(activeTab), {
        method: "GET",
        locale,
        query: {
          page: pageParam,
          page_size: 10,
          sort: sortValue,
        },
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages) => {
      const loadedCount: any = allPages.reduce((sum, page: any) => sum + (page.data?.length ?? 0), 0);

      if (loadedCount < lastPage.count) {
        return lastPage.page + 1;
      }

      return undefined;
    },
    enabled: !!activeTab,
  });

  return (
    <section className="flex flex-col gap-4 lg:gap-8 px-layout-x-space mt-16">
      <div className="w-full flex items-center justify-between">
        <h5 className="text-mobile-h-5 lg:text-h-5">
          {t("MovieDetailPage.Episodes")} {movie.title}
        </h5>
        <DropdownMenu onOpenChange={setOpen} open={open}>
          <DropdownMenuTrigger className="outline-none cursor-pointer text-gray-7 flex items-center gap-2">
            مرتب سازی ({sortValue === SortTypeEnum.ASC ? "صعودی" : "نزولی"})
            <ArrowDown2 className={`size-5 stroke-gray-7 transition-all ${open ? "rotate-180" : ""}`} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="!mt-5 !p-3 w-[182px] bg-gray-13 border border-gray-12 rounded-lg flex flex-col gap-2">
            <DropdownMenuItem onClick={() => setSortValue(SortTypeEnum.ASC)} className={`bg-transparent transition-all ${sortValue === SortTypeEnum.ASC ? "bg-primary" : ""} cursor-pointer`}>
              صعودی
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortValue(SortTypeEnum.DESC)} className={`bg-transparent transition-all ${sortValue === SortTypeEnum.DESC ? "bg-primary" : ""} cursor-pointer`}>
              نزولی
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full overflow-x-auto overflow-y-hidden rounded-md">
        <Tabs defaultValue={movie.seasons?.[0]?.slug} value={activeTab} onValueChange={(e) => setActiveTab(e)} className="w-full">
          <TabsList className="flex flex-nowrap gap-2 lg:gap-5 h-max!">
            {movie.seasons?.map((season) => (
              <TabsTrigger key={season.id} value={season.slug} className={`px-4 lg:px-6 h-8 lg:h-12 rounded-md bg-transparent border border-gray-9 text-gray-9! text-button-s md:text-button-md cursor-pointer transition-all ${activeTab === season.slug ? "border-primary bg-primary text-white!" : ""}`}>
                {season.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="flex flex-col mt-2 lg:mt-0">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-6">
            <EpisodeCardSkeletonComp />
            <EpisodeCardSkeletonComp />
            <EpisodeCardSkeletonComp />
            <EpisodeCardSkeletonComp />
          </div>
        ) : data?.pages[0].count ? (
          <SeasonEpisodesComp episodes={data.pages} />
        ) : (
          <p className="text-center text-gray-9">این فصل قسمتی ندارد</p>
        )}
        {hasNextPage ? (
          <Button disabled={isFetchingNextPage || isLoading} className="border border-primary px-4 lg:px-6 h-8 lg:h-12 rounded-md self-center bg-transparent hover:bg-gray-5/10 cursor-pointer text-primary mt-5 lg:mt-8 text-button-md!" onClick={() => fetchNextPage()}>
            {isFetchingNextPage ? <Spinner /> : null} بیشتر
          </Button>
        ) : null}
      </div>
    </section>
  );
}

export default MovieSeasonsComp;
