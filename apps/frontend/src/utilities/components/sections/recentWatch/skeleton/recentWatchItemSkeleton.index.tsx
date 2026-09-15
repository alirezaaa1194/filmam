import { Skeleton } from "../../../ui";
import RecentWatchItemSkeletonComp from "../recentWatchItem/skeleton/recentWatchItemSkeleton.index";

function RecentWatchSectionSkeletonComp() {
  return (
    <section className="normal-section mt-8 lg:mt-12 ps-layout-x-space max-w-layout-max mx-auto">
      <div className="flex justify-between pe-layout-x-space">
        <Skeleton className="h-6 lg:h-7 w-36 lg:w-52" />
        <Skeleton className="h-6 lg:h-7 w-28 lg:w-24" />
      </div>
      <div className="w-full mt-2 lg:mt-6">
        <div className="flex gap-4 overflow-x-hidden">
          {[1, 2, 3, 4].map((i) => (
            <RecentWatchItemSkeletonComp key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default RecentWatchSectionSkeletonComp;
