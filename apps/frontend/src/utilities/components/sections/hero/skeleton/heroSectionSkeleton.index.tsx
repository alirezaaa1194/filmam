import { Skeleton } from "../../../ui";

function HeroSectionSkeletonComp() {
  return (
    <section className="hero-section relative h-[240px] md:h-[624px] 2xl:h-screen w-full overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(0deg,rgba(12,12,12,1)_0%,rgba(12,12,12,0.96)_13%,rgba(12,12,12,0.4)_33%,rgba(12,12,12,0)_47%,rgba(12,12,12,0.28)_68%,rgba(12,12,12,1)_100%)]" />
      <Skeleton className="absolute top-0 left-0 w-full h-full object-cover bg-gray-12 object-top rounded-none" />
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-end gap-2 lg:gap-8 items-start px-layout-x-space py-8 lg:py-6">
        <div className="w-full flex flex-col gap-2 md:max-w-[393px]">
          <Skeleton className="h-8 md:h-[56px] w-full max-w-[116px] md:max-w-2/4" />
          <div className="hidden xl:flex flex-wrap gap-2">
            <Skeleton className="h-7 w-16 rounded-md" />
            <Skeleton className="h-7 w-16 rounded-md" />
            <Skeleton className="h-7 w-16 rounded-md" />
          </div>
          <Skeleton className="h-4 w-full hidden md:block" />
          <Skeleton className="h-4 w-full hidden md:block" />
          <Skeleton className="h-4 w-full hidden md:block" />
          <Skeleton className="h-4 w-full hidden md:block" />
          <Skeleton className="h-4 w-3/4 hidden md:block" />
        </div>
        <div className="flex gap-2 lg:gap-3">
          <Skeleton className="h-8 lg:h-14 min-w-[106px] lg:min-w-32 rounded-md lg:rounded-lg" />
          <Skeleton className="h-8 lg:h-14 w-7 rounded-md lg:rounded-lg flex lg:hidden" />
          <Skeleton className="h-8 lg:h-14 min-w-[106px] lg:min-w-32 rounded-md lg:rounded-lg hidden lg:flex" />
          <Skeleton className="h-8 lg:h-14 min-w-[106px] lg:min-w-32 rounded-md lg:rounded-lg hidden lg:flex" />
        </div>
      </div>
      <div className="absolute flex items-center gap-2 w-fit! start-0! end-0! mx-auto! lg:start-auto! lg:end-[108px]! bottom-2! lg:bottom-[52px]!">
        <Skeleton className="size-2 md:size-4 rounded-full" />
        <Skeleton className="size-2 md:size-4 rounded-full" />
      </div>
    </section>
  );
}

export default HeroSectionSkeletonComp;
