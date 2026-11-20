import { Skeleton } from "@/utilities/components/ui";

export default function ContactSkeletonComp() {
  return (
    <main className="mx-auto w-full max-w-layout-max px-layout-x-space pb-8 pt-[104px] lg:pb-14 lg:pt-[152px]">
      <Skeleton className="mb-4 h-7 w-40" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex min-h-[164px] flex-col items-center justify-between gap-10 rounded-xl border border-gray-12 bg-gray-13 px-4 py-5 text-center lg:min-h-[288px] lg:py-6"
              >
                <div className="flex flex-col items-center gap-6 text-center w-full">
                  <Skeleton className="size-12 shrink-0 rounded-xl bg-gray-12 lg:size-16" />
                  <span className="flex w-full flex-col items-stretch gap-2 lg:gap-2.5">
                    {Array.from({ length: 4 }).map((__, lineIndex) => (
                      <Skeleton
                        key={lineIndex}
                        className={`${lineIndex === 3 ? "w-1/2" : "w-full"} h-2.5 bg-gray-12 lg:h-3`}
                      />
                    ))}
                  </span>
                </div>
                <Skeleton className="h-6 w-24 bg-gray-12" />
              </div>
            ))}
          </div>
          <div className="flex min-h-20 flex-wrap items-center justify-center gap-x-6 gap-y-3 rounded-xl border border-gray-12 bg-gray-13 px-5 py-5 lg:min-h-[126px] lg:justify-end lg:gap-8 lg:px-10">
            <Skeleton className="h-5 w-36 bg-gray-12" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="size-8 rounded-md bg-gray-12" />
              ))}
            </div>
          </div>
        </section>
        <section className="flex h-fit flex-col gap-5 rounded-xl border border-gray-12 bg-gray-13 p-5 sm:p-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-20 bg-gray-12" />
            <Skeleton className="h-12 w-full rounded-lg bg-gray-12" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24 bg-gray-12" />
            <Skeleton className="h-[172px] w-full rounded-lg bg-gray-12" />
          </div>
          <Skeleton className="h-12 w-full rounded-md bg-gray-12" />
        </section>
      </div>
    </main>
  );
}