import { Skeleton } from "../../../ui";

function MovieCardSkeletonComp() {
  return (
    <div className={`flex-shrink-0 w-[160px] xl:w-[207px] h-[300px] xl:h-[370px]`}>
      <div className="relative rounded-xl overflow-hidden h-full">
        <Skeleton className="w-full h-full rounded-xl" />
        <Skeleton className="absolute top-[6px] start-[6px] text-white text-caption-md px-2 bg-gray-10 rounded-md w-12 h-5" />

        <div className="absolute bottom-0 left-0 w-full h-10! bg-black/70 backdrop-blur-[10px] flex items-center justify-center p-3 rounded-b-md lg:rounded-b-xl">
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="pointer-events-none absolute inset-0 z-20 rounded-xl" />
      </div>
    </div>
  );
}

export default MovieCardSkeletonComp;
