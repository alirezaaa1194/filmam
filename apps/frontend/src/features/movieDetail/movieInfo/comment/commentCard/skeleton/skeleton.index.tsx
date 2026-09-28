import { Skeleton } from "../../../../../../utilities/components/ui";

export function CommentCardSkeletonComp() {
  return (
    <div className="flex flex-col p-4 bg-gray-13 border border-gray-12 rounded-md lg:rounded-xl gap-3 lg:gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 lg:gap-3 min-w-0">
          <Skeleton className="size-9 lg:size-10 rounded-full shrink-0" />
          <div className="flex flex-col gap-1.5 min-w-0">
            <Skeleton className="h-3 w-24 rounded-sm" />
            <Skeleton className="h-2.5 w-16 rounded-sm" />
          </div>
        </div>

        <div className="flex items-center gap-3 lg:gap-5 shrink-0">
          <div className="flex items-center gap-1.5 lg:gap-2">
            <Skeleton className="h-3 w-4 rounded-sm" />
            <Skeleton className="size-5 rounded-sm" />
          </div>
          <div className="flex items-center gap-1.5 lg:gap-2">
            <Skeleton className="h-3 w-4 rounded-sm" />
            <Skeleton className="size-5 rounded-sm" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 ps-0 lg:ps-[52px]">
        <Skeleton className="h-3 w-full rounded-sm" />
        <Skeleton className="h-3 w-[85%] rounded-sm" />
        <Skeleton className="h-3 w-[60%] rounded-sm" />
      </div>
    </div>
  );
}
