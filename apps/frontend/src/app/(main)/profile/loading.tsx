import { Skeleton } from "@/utilities/components/ui";

export default function ProfileLoading() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-layout-max px-layout-x-space pb-16 pt-[104px] lg:pt-[152px]">
      <div className="mb-6 flex gap-2">{Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-10 w-28 rounded-md" />)}</div>
      <Skeleton className="mb-5 h-8 w-36" />
      <div className="grid gap-5 lg:grid-cols-2">{Array.from({ length: 2 }, (_, index) => <Skeleton key={index} className="h-80 rounded-xl" />)}</div>
    </main>
  );
}
