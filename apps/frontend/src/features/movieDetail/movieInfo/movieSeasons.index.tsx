import { ArrowDown2, VideoVertical } from "iconsax-react";
import { AuthModeEnum, MovieDetailPublicType, PaginationType, SeasonEpisodeType, SectionUserMovieTypeEnum, SortTypeEnum, UserMovieActionType, UserMovieTypeEnum } from "../../../types";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Spinner } from "../../../utilities/components/ui";
import { use, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useLocale } from "../../../hooks";
import { Tabs, TabsList, TabsTrigger } from "../../../utilities/components/ui/tabs";
import { ClientCall } from "../../../scripts/client";
import { AppApis } from "../../../data";
import SeasonEpisodesComp from "./episodes/episodes.index";
import EpisodeCardSkeletonComp from "./episodes/episodeCard/skeleton/episodeCardSkeleton.index";
import { useDeviceSubscriptionStatus, useMovieNotification } from "../../../utilities/components/movie/movieFunctionalities/notification/notification.script";
import { UserContext } from "../../../contexts";
import { AuthModalContext } from "../../../contexts/authModal";

function MovieSeasonsComp({ movie }: { movie: MovieDetailPublicType }) {
  const { locale, t } = useLocale();
  const { data: userMovies, isPending } = useQuery({
    queryKey: ["user-movie-actions", movie.id],
    queryFn: () =>
      ClientCall<UserMovieActionType[]>(AppApis.userMovie.movieActions(movie.id), {
        method: "GET",
        locale,
        query: {
          entity_type: SectionUserMovieTypeEnum.MOVIE,
        },
      }),
  });

  const didUserSaved = userMovies?.some((action) => action.type === UserMovieTypeEnum.NOTIFICATION);
  const { hasDeviceSubscription, isCheckingDevice } = useDeviceSubscriptionStatus();
  const { toggleMovieNotification } = useMovieNotification();

  const isFullyActive = didUserSaved && hasDeviceSubscription;

  const user = use(UserContext);
  const { setAuthMode } = use(AuthModalContext);

  if (!movie.seasons?.length) {
    if (didUserSaved === undefined) {
      return;
    }

    return (
      <section className="max-w-layout-max mx-auto px-layout-x-space mt-4 lg:mt-16">
        <div className="bg-gray-13 border border-gray-12 rounded-md lg:rounded-xl flex flex-col items-center justify-center gap-5 lg:gap-6 py-16 lg:py-20">
          <span className="size-14 lg:size-16 rounded-full bg-gray-12 border border-gray-11 flex items-center justify-center">
            <VideoVertical variant="Outline" className="size-7 fill-primary" />
          </span>
          <div className="flex flex-col gap-2 items-center">
            <h5 className="text-h-6 lg:text-h-5">هنوز فصلی اضافه نشده است</h5>
            <span className="text-caption-md lg:text-caption-lg text-gray-7">فصل های جدید به زودی اضافه خواهند شد</span>
          </div>
          {isFullyActive ? (
            ""
          ) : (
            <Button
              className="h-8 lg:h-10 px-7 cursor-pointer rounded-md text-caption-lg"
              onClick={() => {
                if (user) {
                  toggleMovieNotification({
                    movieId: movie.id,
                    isCurrentlyEnabled: didUserSaved,
                    hasDeviceSubscription,
                  });
                } else {
                  setAuthMode({
                    mode: AuthModeEnum.LOGIN,
                    callback: async () => {
                      toggleMovieNotification({
                        movieId: movie.id,
                        isCurrentlyEnabled: didUserSaved,
                        hasDeviceSubscription,
                      });
                    },
                  });
                }
              }}
            >
              فعال‌سازی اعلان‌ها
            </Button>
          )}
        </div>
      </section>
    );
  }

  const [open, setOpen] = useState(false);
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
    <section className="flex flex-col gap-4 lg:gap-8 max-w-layout-max mx-auto px-layout-x-space mt-4 lg:mt-16">
      <div className="w-full flex items-center justify-between">
        <h5 className="text-mobile-h-5 lg:text-h-5">
          {t("MovieDetailPage.Episodes")} {movie.title}
        </h5>
        <DropdownMenu onOpenChange={setOpen} open={open}>
          <DropdownMenuTrigger className="outline-none cursor-pointer text-gray-7 flex items-center gap-2 text-mobile-button-md lg:text-button-md">
            مرتب سازی ({sortValue === SortTypeEnum.ASC ? "صعودی" : "نزولی"})
            <ArrowDown2 className={`size-4 lg:size-5 stroke-gray-7 transition-all ${open ? "rotate-180" : ""}`} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="!mt-5 !p-3 w-[182px] bg-gray-13 border border-gray-12 rounded-lg flex flex-col gap-2">
            <DropdownMenuItem onClick={() => setSortValue(SortTypeEnum.ASC)} className={`bg-transparent transition-all ${sortValue === SortTypeEnum.ASC ? "bg-primary hover:bg-primary/80 rounded-md" : "hover:bg-gray-12"} cursor-pointer`}>
              صعودی
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortValue(SortTypeEnum.DESC)} className={`bg-transparent transition-all ${sortValue === SortTypeEnum.DESC ? "bg-primary hover:bg-primary/80 rounded-md" : "hover:bg-gray-12"} cursor-pointer`}>
              نزولی
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="w-full overflow-x-auto overflow-y-hidden rounded-md pb-2 lg:pb-0">
        <Tabs defaultValue={movie.seasons?.[0]?.slug} value={activeTab} onValueChange={(e) => setActiveTab(e)} className="w-full">
          <TabsList className="flex flex-nowrap gap-2 lg:gap-5 h-max!">
            {movie.seasons?.map((season) => (
              <TabsTrigger key={season.id} value={season.slug} className={`px-4 lg:px-6 h-8 lg:h-12 rounded-md bg-transparent border border-gray-9 text-gray-9! text-button-s md:text-button-md cursor-pointer transition-all ${activeTab === season.slug ? "border-primary bg-primary hover:bg-primary/80 hover:border-primary/80 text-white!" : "hover:border-primary hover:text-primary!"}`}>
                {season.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="flex flex-col">
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
          <div className="bg-gray-13 border border-gray-12 rounded-md lg:rounded-xl flex flex-col items-center justify-center gap-5 lg:gap-6 py-16 lg:py-20">
            <span className="size-14 lg:size-16 rounded-full bg-gray-12 border border-gray-11 flex items-center justify-center">
              <VideoVertical variant="Outline" className="size-7 fill-primary" />
            </span>
            <div className="flex flex-col gap-2 items-center">
              <h5 className="text-h-6 lg:text-h-5">این فصل قسمتی ندارد</h5>
              <span className="text-caption-md lg:text-caption-lg text-gray-7">قسمت‌های جدید به زودی اضافه خواهند شد</span>
            </div>
            <Button className="h-8 lg:h-10 px-7 cursor-pointer rounded-md text-caption-lg">فعال‌سازی اعلان‌ها</Button>
          </div>
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
