import MovieCardSkeletonComp from "../../../../../utilities/components/movie/movieCard/skeleton/movieCardSkeleton.index";
import { Skeleton } from "../../../../../utilities/components/ui";

function NormalSectionSkeletonComp() {
  return (
    <section className="normal-section mt-8 lg:mt-12 ps-layout-x-space max-w-layout-max mx-auto">
      <div className="flex justify-between pe-layout-x-space">
        <Skeleton className="h-6 lg:h-7 w-36 lg:w-52" />
        <Skeleton className="h-6 lg:h-7 w-28 lg:w-24" />
      </div>
      <div className="w-full mt-6 lg:mt-8">
        <div className="flex gap-4 overflow-x-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <MovieCardSkeletonComp key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default NormalSectionSkeletonComp;
