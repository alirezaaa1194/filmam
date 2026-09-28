import MovieFunctionalitiesSkeletonComp from "../../../../../utilities/components/movie/movieFunctionalities/skeleton/movieFunctionalitiesSkeleton.index";
import { Skeleton } from "@/utilities/components/ui";
import MovieHeaderMetaDataSkeletonComp from "../metaData/skeleton/skeleton.index";
import MovieCardSkeletonComp from "../../../../../utilities/components/movie/movieCard/skeleton/movieCardSkeleton.index";

function MovieHeaderSkeletonComp() {
  return (
    <section className="w-full relative lg:h-[624px] 2xl:h-screen max-w-full overflow-x-hidden">
      <div className="absolute z-10 top-0 left-0 w-full h-[250px] lg:h-full bg-[linear-gradient(0deg,rgba(12,12,12,1)_0%,rgba(12,12,12,0.96)_13%,rgba(12,12,12,0.4)_33%,rgba(12,12,12,0)_47%,rgba(12,12,12,0.28)_68%,rgba(12,12,12,1)_100%)]" />
      <div className="hidden lg:block absolute z-10 top-0 left-0 w-full h-full bg-[linear-gradient(90deg,rgba(12,12,12,1)_0%,rgba(12,12,12,0)_28%,rgba(12,12,12,0.55)_52%,rgba(12,12,12,1)_100%)]" />
      {/* Banner */}
      <Skeleton className="w-full h-[250px] lg:h-full rounded-none" />

      {/* Content */}
      <div className="lg:absolute z-20 top-0 left-0 right-0 w-full max-w-layout-max mx-auto flex gap-12 lg:h-full px-layout-x-space pb-10 xl:pb-5">
        {/* MovieCard (only xl+) */}
        <div className="w-fit h-fit self-end py-8 lg:py-6 hidden xl:block">
          <MovieCardSkeletonComp />
        </div>

        <div className="w-full min-w-0 h-full flex flex-col justify-end items-start lg:py-6">
          <div className="flex flex-col gap-4 w-full">
            {/* Title */}
            <Skeleton className="h-8 lg:h-12 w-3/4 max-w-[350px] rounded" />

            {/* Genres (lg+) */}
            <div className="hidden lg:flex flex-wrap gap-2">
              <Skeleton className="h-[30px] w-16 rounded-md" />
              <Skeleton className="h-[30px] w-20 rounded-md" />
              <Skeleton className="h-[30px] w-14 rounded-md" />
              <Skeleton className="h-[30px] w-18 rounded-md" />
            </div>

            {/* MetaData */}
            <MovieHeaderMetaDataSkeletonComp />
          </div>

          {/* Functionalities */}
          <MovieFunctionalitiesSkeletonComp />
        </div>
      </div>
    </section>
  );
}

export default MovieHeaderSkeletonComp;
