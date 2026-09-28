import { Skeleton } from "../../../../../../utilities/components/ui";

function MovieHeaderMetaDataSkeletonComp() {
  return (
    <div className="w-full min-w-0 pb-2 flex justify-between lg:justify-start gap-4 lg:gap-10 text-nowrap overflow-x-hidden lg:scrollbar-none mb-2">
      <Skeleton className="h-6 w-28 lg:w-32 shrink-0 rounded" />
      <Skeleton className="h-6 w-20 lg:w-24 shrink-0 rounded" />
      <Skeleton className="h-6 w-36 xl:hidden shrink-0 rounded" />
      <Skeleton className="h-6 w-28 lg:w-32 shrink-0 rounded" />
      <Skeleton className="h-6 w-14 shrink-0 rounded" />
      <Skeleton className="h-6 w-16 shrink-0 rounded" />
      <Skeleton className="h-6 w-10 shrink-0 rounded" />
    </div>
  );
}

export default MovieHeaderMetaDataSkeletonComp;
