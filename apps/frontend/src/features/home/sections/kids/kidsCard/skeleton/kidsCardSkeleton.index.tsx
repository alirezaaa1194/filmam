import { Skeleton } from "../../../../../../utilities/components/ui";

function KidsCardSkeletonComp({ className }: { className: string }) {
  return (
    <div className={`flex-shrink-0 w-[160px] xl:w-[207px] h-[300px] xl:h-[370px] select-none ${className}`}>
      <div className="relative rounded-xl overflow-hidden h-full">
        <Skeleton className="w-full h-full rounded-xl" />
        <div className="absolute bottom-0 left-0 w-full h-10! bg-black/70 backdrop-blur-[10px] flex items-center justify-center p-3 rounded-b-md lg:rounded-b-xl">
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="pointer-events-none absolute inset-0 z-20 rounded-xl" />
      </div>
    </div>
  );
}

export default KidsCardSkeletonComp;
