"use client";

import { Skeleton } from "../../../../../utilities/components/ui";

export function MovieAboutSkeletonComp() {
  return (
    <div className="flex flex-col gap-2 lg:gap-4">
      <Skeleton className="h-6 lg:h-7 w-40 rounded-sm" />

      <div className="flex flex-col gap-2">
        <Skeleton className="h-3.5 w-full rounded-sm" />
        <Skeleton className="h-3.5 w-full rounded-sm" />
        <Skeleton className="h-3.5 w-[92%] rounded-sm" />
        <Skeleton className="h-3.5 w-[75%] rounded-sm" />
      </div>
    </div>
  );
}

export function MovieDescriptionSkeletonComp() {
  return (
    <section className="w-full px-layout-x-space max-w-layout-max mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        <div className="flex flex-col gap-2 lg:gap-4">
          <Skeleton className="h-6 lg:h-7 w-48 rounded-sm" />

          <div className="flex flex-col gap-2">
            <Skeleton className="h-3.5 w-full rounded-sm" />
            <Skeleton className="h-3.5 w-full rounded-sm" />
            <Skeleton className="h-3.5 w-full rounded-sm" />
            <Skeleton className="h-3.5 w-[88%] rounded-sm" />
            <Skeleton className="h-3.5 w-[60%] rounded-sm" />
          </div>
        </div>

        <MovieAboutSkeletonComp />
      </div>
    </section>
  );
}
