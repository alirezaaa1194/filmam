import { Skeleton } from "../../../../../utilities/components/ui";

function EpisodeFactorsSkeletonComp() {
  return (
    <section className="w-full px-layout-x-space max-w-layout-max mx-auto flex flex-col gap-4 lg:gap-7">
      {/* Actors Section */}
      <div className="flex flex-col gap-2 lg:gap-4">
        <Skeleton className="h-5 lg:h-6 w-24 lg:w-28 rounded" />

        <div className="flex flex-wrap gap-2 lg:gap-5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={`actor-skeleton-${i}`} className="flex items-center gap-1.5 lg:gap-2 p-1 border border-gray-11 rounded-full pe-2.5 lg:pe-3">
              <Skeleton className="size-10 lg:size-12 rounded-full shrink-0" />
              <Skeleton className="h-3.5 lg:h-4 w-16 lg:w-20 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Factors / Creators Section */}
      <div className="flex flex-col gap-2 lg:gap-4">
        <Skeleton className="h-5 lg:h-6 w-28 lg:w-32 rounded" />

        <div className="flex flex-wrap gap-x-5 gap-y-3 lg:gap-x-8 lg:gap-y-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`factor-skeleton-${i}`} className="flex flex-col gap-0.5 lg:gap-1">
              <Skeleton className="h-4 lg:h-5 w-28 lg:w-36 rounded" />
              <Skeleton className="h-3.5 lg:h-4 w-16 lg:w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default EpisodeFactorsSkeletonComp;
