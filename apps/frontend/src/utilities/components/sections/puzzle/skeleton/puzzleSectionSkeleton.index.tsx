import { Skeleton } from "../../../ui";
import PuzzleMovieItemSkeletonComp from "../movieItem/skeleton/puzzleMovieItemSkeleton.index";

function PuzzleSectionSkeletonComp() {
  return (
    <section className="puzzle-section max-w-layout-max mx-auto mt-20 px-layout-x-space flex flex-col gap-2 lg:gap-4">
      <Skeleton className="h-6 lg:h-7 w-48" />
      <div className="flex flex-col xl:flex-row items-stretch gap-6">
        <div className="w-full xl:max-w-[665px] rounded-xl overflow-hidden relative">
          <Skeleton className="w-full h-[350px] xl:h-[370px] rounded-xl" />
          <div className="absolute inset-x-0 bottom-0 w-full lg:min-h-14 bg-black/30 backdrop-blur-[10px] z-10 rounded-b-xl flex items-center p-3 flex items-center justify-between">
            <Skeleton className="w-1/3 h-4 bg-gray-10" />
            <div className="flex gap-1 lg:gap-2">
              <Skeleton className="size-2 lg:size-4 bg-gray-10" />
              <Skeleton className="size-2 lg:size-4 bg-gray-10" />
              <Skeleton className="size-2 lg:size-4 bg-gray-10" />
              <Skeleton className="size-2 lg:size-4 bg-gray-10" />
            </div>
          </div>
        </div>
        <div className="w-full h-full xl:max-w-[535px] hidden xl:grid grid-cols-2 gap-y-3 lg:gap-y-6 gap-x-3">
          <PuzzleMovieItemSkeletonComp />
          <PuzzleMovieItemSkeletonComp />
          <PuzzleMovieItemSkeletonComp />
          <PuzzleMovieItemSkeletonComp />
        </div>
      </div>
    </section>
  );
}

export default PuzzleSectionSkeletonComp;
