import { Skeleton } from "@/utilities/components/ui";

export default function ContactSkeletonComp() {
  return (
    <main className="mx-auto w-full max-w-layout-max px-layout-x-space pb-8 pt-[104px] lg:pb-14 lg:pt-[152px]">
      <Skeleton className="mb-4 h-7 w-40" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
            {Array.from({ length: 3 }).map((_, index) => <div key={index} className="flex min-h-[164px] flex-col items-center justify-between py-5 lg:min-h-[288px] lg:py-6"><div className="flex flex-col items-center gap-6"><Skeleton className="size-12 rounded-xl lg:size-16" /><Skeleton className="h-14 w-32" /></div><Skeleton className="h-6 w-24" /></div>)}
          </div>
          <div className="flex min-h-20 items-center justify-center gap-6 py-5 lg:min-h-[126px]"><Skeleton className="h-5 w-36" /><div className="flex gap-2">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="size-8 rounded-md" />)}</div></div>
        </section>
        <section className="flex flex-col gap-5 p-5 sm:p-6"><Skeleton className="h-5 w-24" /><Skeleton className="h-[172px] w-full rounded-lg" /><Skeleton className="h-12 w-full rounded-md" /></section>
      </div>
    </main>
  );
}
