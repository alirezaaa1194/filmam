import { Skeleton } from "../../../../../utilities/components/ui";
import EpisodeCardSkeletonComp from "../../episodes/episodeCard/skeleton/episodeCardSkeleton.index";
import SortEpisodesSkeletonComp from "../sortEpisodes/skeleton/skeleton.index";

function MovieSeasonsSkeletonComp() {
  return (
    <section className="flex flex-col gap-2 lg:gap-4 w-full max-w-layout-max mx-auto px-layout-x-space">
      {/* Header: Title + Sort */}
      <div className="w-full flex items-center justify-between">
        <Skeleton className="h-6 lg:h-7 w-48 lg:w-64 rounded" />
        <SortEpisodesSkeletonComp />
      </div>

      {/* Tabs */}
      <div className="w-full overflow-x-auto overflow-hidden rounded-md pb-2 lg:pb-0">
        <div className="flex flex-nowrap gap-2 lg:gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 lg:h-12 w-20 lg:w-28 rounded-md shrink-0" />
          ))}
        </div>
      </div>

      {/* Episodes Grid */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <EpisodeCardSkeletonComp key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default MovieSeasonsSkeletonComp;
