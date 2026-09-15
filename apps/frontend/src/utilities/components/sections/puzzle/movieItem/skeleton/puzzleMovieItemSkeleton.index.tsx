import { Skeleton } from "../../../../ui";

function PuzzleMovieItemSkeletonComp() {
  return (
    <div className="h-max flex gap-3">
      <Skeleton className="h-[173px] w-[106px] xl:max-w-[105px] self-stretch rounded-xl" />
      <div className="hidden xl:flex flex-col justify-center gap-3">
        <Skeleton className="h-6 w-40" />
        <div className="flex items-center gap-1">
          <Skeleton className="size-6 rounded-md shrink-0" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="size-6 rounded-md shrink-0" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="size-6 rounded-md shrink-0" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="size-6 rounded-md shrink-0" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}

export default PuzzleMovieItemSkeletonComp;
