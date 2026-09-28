import { Skeleton } from "../../../ui";

function MovieFunctionalitiesSkeletonComp() {
  return (
    <div className="flex items-center flex-col lg:flex-row lg:justify-start gap-4 w-full">
      {/* Play + Trailer group */}
      <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-fit">
        {/* Play button */}
        <Skeleton className="h-[46px] w-full lg:w-[160px] rounded-md" />
        {/* Trailer button */}
        <Skeleton className="h-[46px] w-full lg:w-[120px] rounded-md" />
      </div>

      {/* Action buttons (save / notif / like / dislike / download) */}
      <div className="w-full flex items-center lg:justify-start gap-4">
        <Skeleton className="flex-1 lg:flex-0 h-[46px] lg:size-[46px] lg:min-w-[46px] rounded-md shrink-0" />
        <Skeleton className="flex-1 lg:flex-0 h-[46px] lg:size-[46px] lg:min-w-[46px] rounded-md shrink-0" />
        <Skeleton className="flex-1 lg:flex-0 h-[46px] lg:size-[46px] lg:min-w-[46px] rounded-md shrink-0" />
        <Skeleton className="flex-1 lg:flex-0 h-[46px] lg:size-[46px] lg:min-w-[46px] rounded-md shrink-0" />
      </div>
    </div>
  );
}

export default MovieFunctionalitiesSkeletonComp;
