"use client";

import { Skeleton } from "../../../utilities/components/ui";

export default function PlayerSkeletonComp() {
  return (
    <main className="h-[100svh] w-full overflow-hidden bg-gray-13 relative">
      <div className="absolute inset-0 bg-gray-12" />

      <div className="absolute top-0 left-0 right-0 w-full flex items-center justify-between pt-4 px-3 lg:p-10">
        <Skeleton className="h-11 w-32 rounded-full" />

        <div className="flex items-center gap-4">
          <Skeleton className="size-11 rounded-full" />
          <Skeleton className="size-11 rounded-full" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 w-full pb-4 px-3 lg:p-10 flex flex-col gap-3 lg:gap-6 bg-gradient-to-t from-black/75 to-transparent">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 lg:h-7 w-48 lg:w-72 rounded-md" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>

        <div className="w-full flex flex-col gap-3 lg:gap-7">
          <div className="flex items-center justify-between order-2 lg:order-1 gap-2">
            <div className="flex items-center bg-gray-14 lg:bg-transparent rounded-full px-2 py-1 gap-2">
              <div className="flex items-center gap-2 lg:gap-4">
                <Skeleton className="size-11 lg:size-12 rounded-full" />
                <Skeleton className="hidden lg:block size-12 rounded-full" />
                <Skeleton className="size-11 lg:size-12 rounded-full" />
                <Skeleton className="size-11 lg:size-12 rounded-full" />
                <Skeleton className="size-11 lg:size-12 rounded-full" />
                <Skeleton className="size-11 lg:size-12 rounded-full" />
              </div>

              <span className="w-px h-4 bg-gray-11 shrink-0 mx-2 lg:hidden" />

              <Skeleton className="size-7 rounded-full lg:hidden" />
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              <div className="flex items-center bg-gray-14 lg:bg-transparent rounded-full h-11 lg:h-12">
                <Skeleton className="w-11 lg:w-12 h-full rounded-full" />
              </div>

              <Skeleton className="size-11 rounded-full lg:hidden" />

              <Skeleton className="hidden lg:block size-12 rounded-full" />
              <Skeleton className="hidden lg:block size-12 rounded-full" />
              <Skeleton className="hidden lg:block size-12 rounded-full" />
              <Skeleton className="hidden lg:block size-12 rounded-full" />
            </div>
          </div>

          <div className="flex flex-col-reverse lg:flex-col gap-1.5 order-1 lg:order-2">
            <Skeleton className="h-1 w-full rounded-full" />
            <div className="w-full flex items-center justify-between">
              <Skeleton className="h-4 w-12 rounded-md" />
              <Skeleton className="h-4 w-12 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
