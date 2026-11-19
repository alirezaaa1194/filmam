import MovieCardSkeletonComp from "@/utilities/components/movie/movieCard/skeleton/movieCardSkeleton.index";
import RecentWatchItemSkeletonComp from "@/features/home/sections/recentWatch/recentWatchItem/skeleton/recentWatchItemSkeleton.index";
import { Skeleton } from "@/utilities/components/ui";

export default function UserPanelSkeletonComp({ watched = false, profile = false, count = 6 }: { watched?: boolean; profile?: boolean; count?: number }) {
  return profile ? (
    <>
      <Skeleton className="mb-5 h-8 w-36" />
      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        <Skeleton className="h-[420px] rounded-xl" />
        <Skeleton className="h-[520px] rounded-xl" />
      </div>
    </>
  ) : watched ? (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {Array.from({ length: count }, (_, index) => (
        <RecentWatchItemSkeletonComp key={index} className="w-full" />
      ))}
    </div>
  ) : (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
      {Array.from({ length: count }, (_, index) => <MovieCardSkeletonComp key={index} compact />)}
    </div>
  );
}
