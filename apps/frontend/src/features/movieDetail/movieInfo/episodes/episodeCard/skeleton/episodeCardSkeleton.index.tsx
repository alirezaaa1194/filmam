import { Separator, Skeleton } from "../../../../../../utilities/components/ui";

function EpisodeCardSkeletonComp() {
  return (
    <div className="w-full border border-gray-12 bg-gray-13 rounded-md lg:rounded-xl p-3 lg:p-4 flex gap-3 lg:gap-4">
      {/* Cover Image */}
      <Skeleton className="shrink-0 w-[110px] h-[145px] lg:w-[156px] lg:h-[198px] rounded-lg" />

      <div className="flex flex-col flex-1 min-w-0">
        {/* Top: Episode number + actions */}
        <div className="flex flex-col gap-1 lg:gap-2">
          <div className="w-full flex items-center justify-between gap-3">
            <Skeleton className="h-7 w-32 lg:w-40 rounded" />
            <div className="flex items-center gap-3">
              <Skeleton className="size-5 rounded-full w-20!" />
              <Skeleton className="size-5 rounded-full" />
            </div>
          </div>

          {/* Description (only lg+) */}
          <div className="hidden lg:flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-full max-w-[280px] rounded" />
            <Skeleton className="h-3.5 w-4/5 max-w-[220px] rounded" />
          </div>
        </div>

        {/* Middle: Duration */}
        <div className="flex items-start justify-between gap-4 mt-auto">
          <Skeleton className="h-4 w-24 lg:min-w-[104px] rounded" />
        </div>

        {/* Bottom: Separator + Like/Dislike + Watch button */}
        <div className="pt-4">
          <Separator className="bg-gray-12 w-full mb-3 lg:mb-4" />
          <div className="flex gap-3 lg:gap-4">
            <div className="flex gap-2">
              <Skeleton className="size-8 lg:size-12 rounded-md" />
              <Skeleton className="size-8 lg:size-12 rounded-md" />
            </div>
            <Skeleton className="flex-1 h-8 lg:h-12 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EpisodeCardSkeletonComp;
