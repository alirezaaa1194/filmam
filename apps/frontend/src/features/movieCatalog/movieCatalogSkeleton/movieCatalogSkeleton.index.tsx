import { Skeleton } from "@/utilities/components/ui";
import { Button } from "@/utilities/components/ui";
import { Filter } from "iconsax-react";
import { ArrowDown2 } from "iconsax-react";
import MovieCardSkeletonComp from "@/utilities/components/movie/movieCard/skeleton/movieCardSkeleton.index";

export default function MovieCatalogSkeletonComp() {
  return (
    <main className="min-h-screen px-layout-x-space pb-16 pt-[104px] lg:pt-[152px]">
      <div className="mx-auto w-full max-w-layout-max">
        <Skeleton className="mb-4 h-8 w-44 bg-gray-12" />
        <section className="mb-6 min-w-0 select-none overflow-hidden rounded-lg bg-gray-12 p-3 sm:p-4" aria-hidden="true">
          <div className="grid min-w-0 grid-cols-2 items-center gap-3 xl:grid-cols-[repeat(7,minmax(0,1fr))_auto]">
            {Array.from({ length: 7 }).map((_, index) => <div key={index} className="flex h-11 w-full min-w-0 items-center justify-between rounded-md border border-gray-10 bg-gray-13 px-3">
              <Skeleton className={`h-3 bg-gray-11 ${index % 2 === 0 ? "w-12" : "w-16"}`} />
              <ArrowDown2 className="size-4 shrink-0 stroke-white text-white" />
            </div>)}
            <Button disabled className="col-span-2 h-11 w-full cursor-not-allowed gap-2 rounded-md bg-gray-11 text-gray-8 opacity-100 xl:col-span-1 xl:w-[132px]">
              <Filter className="size-4 fill-gray-8" />
              <Skeleton className="h-3 w-20 bg-gray-9" />
            </Button>
          </div>
        </section>
        <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-5 lg:gap-6">
          {Array.from({ length: 20 }).map((_, index) => <MovieCardSkeletonComp key={index} compact />)}
        </div>
      </div>
    </main>
  );
}
