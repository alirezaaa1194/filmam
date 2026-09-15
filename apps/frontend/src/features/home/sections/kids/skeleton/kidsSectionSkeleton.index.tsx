import { Skeleton } from "../../../../../utilities/components/ui";
import KidsCardSkeletonComp from "../kidsCard/skeleton/kidsCardSkeleton.index";

function KidsSectionSkeletonComp() {
  return (
    <section className="kids-section mt-8 lg:mt-12 lg:px-layout-x-space max-w-layout-max mx-auto">
      <div className="flex justify-center">
        <Skeleton className="h-[32px] lg:h-[40px] w-40 lg:w-52" />
      </div>
      <div className="w-full mt-6 lg:mt-8">
        <div className="flex gap-4 justify-center items-center overflow-x-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <KidsCardSkeletonComp key={i} className={i === 3 ? "w-[250px] xl:w-[250px] h-[400px] xl:h-[480px]" : ""} />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 lg:gap-4 mt-8">
        <Skeleton className="size-2 lg:size-4 rounded-full" />
        <Skeleton className="size-2 lg:size-4 rounded-full" />
        <Skeleton className="size-2 lg:size-4 rounded-full" />
      </div>
      <div className="flex items-center justify-between mt-12 gap-14 px-layout-x-space lg:px-0">
        <Skeleton className="h-4 w-40 lg:w-56 hidden lg:block" />
        <Skeleton className="h-8 w-full lg:w-32 rounded-md" />
      </div>
    </section>
  );
}

export default KidsSectionSkeletonComp;
