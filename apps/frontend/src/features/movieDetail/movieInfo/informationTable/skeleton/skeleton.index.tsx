"use client";

import { Skeleton } from "../../../../../utilities/components/ui";

function InfoCellSkeleton({ valueWidth = "w-24", valueHeight = "h-3.5" }: { valueWidth?: string; valueHeight?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-3 w-16 rounded-sm" />
      <Skeleton className={`${valueHeight} ${valueWidth} rounded-sm`} />
    </div>
  );
}

function GenresCellSkeleton() {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-3 w-16 rounded-sm" />
      <div className="flex flex-wrap gap-1.5">
        <Skeleton className="h-6 w-14 rounded-md" />
        <Skeleton className="h-6 w-16 rounded-md" />
        <Skeleton className="h-6 w-12 rounded-md" />
      </div>
    </div>
  );
}

function ScoreCellSkeleton() {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-3 w-16 rounded-sm" />
      <span className="flex items-center gap-5">
        <span className="flex items-center gap-1">
          <Skeleton className="h-3.5 w-8 rounded-sm" />
          <Skeleton className="w-6 h-2 rounded-sm" />
        </span>
        <span className="flex items-center gap-1">
          <Skeleton className="h-3.5 w-8 rounded-sm" />
          <Skeleton className="w-6 h-2 rounded-sm" />
        </span>
      </span>
    </div>
  );
}

export function MovieInformationTableSkeletonComp() {
  return (
    <section className="px-layout-x-space w-full max-w-layout-max mx-auto">
      <Skeleton className="h-6 lg:h-7 w-40 rounded-sm mb-2 lg:mb-4" />

      <div className="bg-gray-13 border border-gray-12 rounded-md lg:rounded-xl p-4 lg:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-4 lg:gap-x-8">
          <GenresCellSkeleton />

          <ScoreCellSkeleton />

          <InfoCellSkeleton valueWidth="w-28" />

          <InfoCellSkeleton valueWidth="w-32" />

          <InfoCellSkeleton valueWidth="w-24" />

          <InfoCellSkeleton valueWidth="w-10" />

          <InfoCellSkeleton valueWidth="w-14" />
        </div>
      </div>
    </section>
  );
}
