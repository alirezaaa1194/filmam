import { Skeleton } from "../../../ui";

function MovieCardSkeletonComp() {
  return (
    <div className={`flex-shrink-0 w-[160px] xl:w-[227px] h-[300px] xl:h-[370px]`}>
      <div className="relative rounded-xl overflow-hidden h-full">
        <Skeleton className="w-full h-full rounded-xl" />
        <Skeleton className="absolute top-[6px] start-[6px] text-white text-caption-md px-2 bg-gray-10 rounded-md w-12 h-5" />

        <div className="absolute bottom-0 left-0 w-full bg-black/70 backdrop-blur-[10px] flex items-center justify-center xl:justify-between p-3 rounded-b-xl">
          <Skeleton className="h-5 w-25" />
          <Skeleton className="h-5 w-8 hidden xl:flex" />
        </div>
        <div className="pointer-events-none absolute inset-0 z-20 rounded-xl" />
      </div>
    </div>
  );
}

export default MovieCardSkeletonComp;
