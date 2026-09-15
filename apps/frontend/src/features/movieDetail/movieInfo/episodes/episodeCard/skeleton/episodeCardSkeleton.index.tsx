import { Separator, Skeleton } from "../../../../../../utilities/components/ui";

function EpisodeCardSkeletonComp() {
  return (
    <div className="w-full border border-gray-12 bg-gray-13 rounded-md lg:rounded-xl px-2 lg:px-4 py-4 flex gap-2 lg:gap-4 items-stretch">
      <Skeleton className="shrink-0 w-[97px] h-[124px] lg:w-[156px] lg:h-[198px] rounded-lg" />
      <div className="flex flex-col flex-1 gap-4 lg:gap-5">
        <div className="flex flex-col gap-2 lg:gap-3">
          <Skeleton className="h-4 lg:h-5 w-3/4" />
          <Skeleton className="h-3.5 lg:h-4 w-1/2" />
        </div>
        <Separator className="bg-gray-12 w-full" />
        <div className="flex gap-4 lg:gap-5">
          <div className="flex gap-2">
            <Skeleton className="size-8 lg:size-12 rounded-md" />
            <Skeleton className="size-8 lg:size-12 rounded-md" />
          </div>
          <Skeleton className="flex-1 h-8 lg:h-12 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default EpisodeCardSkeletonComp;
