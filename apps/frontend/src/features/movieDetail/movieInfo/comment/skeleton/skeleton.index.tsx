"use client";

import { Skeleton } from "../../../../../utilities/components/ui";
import { CommentCardSkeletonComp } from "../commentCard/skeleton/skeleton.index";
import { CommentInputSkeletonComp } from "../commentInput/skeleton/skeleton.index";
import { CommentSourcePickerSkeletonComp } from "../commentSourcePicker/skeleton/skeleton.index";

export function CommentSectionSkeletonComp() {
  return (
    <section className="w-full px-layout-x-space max-w-layout-max mx-auto flex flex-col gap-2 lg:gap-4">
      <Skeleton className="h-7 w-20 rounded-sm" />
      <div className="flex flex-col gap-3">
        <CommentSourcePickerSkeletonComp />
        <CommentInputSkeletonComp />
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, idx) => (
            <CommentCardSkeletonComp key={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
