import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowDown2 } from "iconsax-react";
import { useLocale } from "../../../../hooks";
import { MovieDetailPublicType, PaginationType, SeasonEpisodeType, SectionUserMovieTypeEnum, SortTypeEnum, UserMovieActionType, UserMovieTypeEnum } from "../../../../types";
import { ClientCall } from "../../../../scripts/client";
import { AppApis } from "../../../../data";
import { useMovieNotificationAction } from "./movieSeasons.script";
import SortEpisodesComp from "./sortEpisodes/sortEpisodes.index";
import { Tabs, TabsList, TabsTrigger } from "../../../../utilities/components/ui/tabs";
import SeasonsEmptyStateComp from "./emptyState/emptyState.index";
import NotifyButtonComp from "./notifyButton/notifyButton.index";
import EpisodeCardSkeletonComp from "../episodes/episodeCard/skeleton/episodeCardSkeleton.index";
import SeasonEpisodesComp from "../episodes/episodes.index";
import { Button, Spinner } from "../../../../utilities/components/ui";

function MovieSeasonsComp({ movie }: { movie: MovieDetailPublicType }) {
  const { locale, t } = useLocale();
  const { data: userMovies } = useQuery({
    queryKey: ["user-movie-actions", movie.id],
    queryFn: () =>
      ClientCall<UserMovieActionType[]>(AppApis.userMovie.movieActions(movie.id), {
        method: "GET",
        locale,
        query: { entity_type: SectionUserMovieTypeEnum.MOVIE },
      }),
  });

  const didUserSaved = userMovies?.some((action) => action.type === UserMovieTypeEnum.NOTIFICATION);
  const { isFullyActive, handleToggle } = useMovieNotificationAction(movie, didUserSaved);
  const [open, setOpen] = useState(false);
  const [sortValue, setSortValue] = useState<SortTypeEnum>(SortTypeEnum.ASC);
  const [activeTab, setActiveTab] = useState<string>(movie.seasons?.[0]?.slug ?? "");
  const [unwatchedEpisodes, setUnwatchedEpisodes] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["episodes", activeTab, locale, sortValue, unwatchedEpisodes],
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
    enabled: !!activeTab,
  });

  const hasSeasons = !!movie.seasons?.length;

  if (!hasSeasons) {
    if (didUserSaved === undefined) return null;

    return (
      <section className="max-w-layout-max mx-auto px-layout-x-space mt-4 lg:mt-16">
        <SeasonsEmptyStateComp variant="noSeasons" title="هنوز فصلی اضافه نشده است" description="فصل های جدید به زودی اضافه خواهند شد" action={!isFullyActive ? <NotifyButtonComp onClick={handleToggle} /> : null} />
      </section>
    );
  }

  const totalCount = data?.pages?.[0]?.count ?? 0;
  const isListEmpty = !isLoading && data && totalCount === 0;
  const isEmptyBecauseAllWatched = isListEmpty && unwatchedEpisodes;
  const isEmptyBecauseNoEpisodes = isListEmpty && !unwatchedEpisodes;

  return (
    <section className="flex flex-col gap-4 lg:gap-8 w-full max-w-layout-max mx-auto px-layout-x-space">
      <div className="w-full flex items-center justify-between">
        <h5 className="text-mobile-h-5 lg:text-h-5">
          {t("MovieDetailPage.Episodes")} {movie.title}
        </h5>
        <SortEpisodesComp open={open} onOpenChange={setOpen} sortValue={sortValue} onSortChange={setSortValue} unwatchedEpisodes={unwatchedEpisodes} onUnwatchedChange={setUnwatchedEpisodes} />
      </div>
      <div className="w-full overflow-x-auto overflow-y-hidden rounded-md pb-2 lg:pb-0">
        <Tabs defaultValue={movie.seasons?.[0]?.slug} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-nowrap gap-2 lg:gap-5 h-max!">
            {movie.seasons?.map((season) => (
              <TabsTrigger key={season.id} value={season.slug} className={`px-4 lg:px-6 h-8 lg:h-12 rounded-md bg-transparent border border-gray-9 text-gray-9! text-button-s md:text-button-md cursor-pointer transition-all ${activeTab === season.slug ? "border-primary bg-primary hover:bg-primary/80 hover:border-primary/80 text-white!" : "hover:border-primary hover:text-primary!"}`}>
                {season.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="flex flex-col gap-4">
        {isLoading || !data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <EpisodeCardSkeletonComp key={i} />
            ))}
          </div>
        ) : totalCount ? (
          <SeasonEpisodesComp episodes={data.pages} />
        ) : isEmptyBecauseAllWatched ? (
          <SeasonsEmptyStateComp variant="allWatched" title="همه قسمت‌ها را مشاهده کرده‌اید" description="برای دیدن قسمت‌های بیشتر، فیلتر «مشاهده نشده» را غیرفعال کنید" />
        ) : isEmptyBecauseNoEpisodes ? (
          <SeasonsEmptyStateComp variant="noEpisodes" title="این فصل قسمتی ندارد" description="قسمت‌های جدید به زودی اضافه خواهند شد" action={!isFullyActive ? <NotifyButtonComp onClick={handleToggle} /> : null} />
        ) : null}
        {hasNextPage ? (
          <Button disabled={isFetchingNextPage || isLoading} onClick={() => fetchNextPage()} className="h-10 px-8 w-fit mx-auto rounded-md cursor-pointer border-gray-10 text-gray-10 hover:text-primary hover:border-primary hover:[&>svg]:stroke-primary" variant="outline">
            مشاهده بیشتر {isFetchingNextPage ? <Spinner /> : <ArrowDown2 className="stroke-gray-10 size-5 transition-all" />}
          </Button>
        ) : null}
      </div>
    </section>
  );
}

export default MovieSeasonsComp;
