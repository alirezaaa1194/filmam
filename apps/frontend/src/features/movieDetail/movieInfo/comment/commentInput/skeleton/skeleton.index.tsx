import { Skeleton } from "../../../../../../utilities/components/ui";

export function CommentInputSkeletonComp() {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-13 border border-gray-12 rounded-md lg:rounded-xl gap-10 lg:gap-16">
      <div className="flex items-start gap-3 flex-1">
        <Skeleton className="size-10 rounded-full shrink-0" />
        <div className="relative w-full">
          <Skeleton className="w-full min-h-12 h-12 rounded-md" />
          <Skeleton className="size-5 rounded-md absolute inset-e-4 top-[13px] bg-gray-10" />
        </div>
      </div>
    </div>
  );
}
