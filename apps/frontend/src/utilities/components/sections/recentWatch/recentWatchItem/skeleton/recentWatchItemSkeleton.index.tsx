"use client";
import { Skeleton } from "../../../../ui";
import { useLocale } from "../../../../../../hooks";

function RecentWatchItemSkeletonComp() {
  const { dir } = useLocale();
  return (
    <div className="block shrink-0 relative rounded-md lg:rounded-xl overflow-hidden select-none w-[250px] lg:w-[392px] h-40 xl:h-60">
      <Skeleton className="h-full w-full rounded-none" />
      <div className="absolute rounded-b-md lg:rounded-b-xl bottom-0 left-0 bg-black/70 backdrop-blur-[15px] w-full z-10 flex flex-col gap-px p-2">
        <Skeleton className="h-3.5 lg:h-3 w-3/4" />
        <div className="w-full flex items-center justify-between gap-4 pt-1">
          <Skeleton className={`shrink-0 h-3 lg:h-3.5 w-10 ${dir === "rtl" ? "order-1" : "order-3"}`} />
          <div className="order-2 flex-1 relative h-4 flex items-center">
            <Skeleton className="absolute inset-x-0 h-1.5 rounded-full" />
            <Skeleton className="absolute left-0 h-1.5 rounded-full w-[35%]" />
            <Skeleton className="absolute left-[35%] -translate-x-1/2 size-3.5 rounded-full border-2 border-gray-11 shadow-sm" />
          </div>
          <Skeleton className={`shrink-0 h-3 lg:h-3.5 w-10 ${dir === "rtl" ? "order-3" : "order-1"}`} />
        </div>
      </div>
    </div>
  );
}

export default RecentWatchItemSkeletonComp;
