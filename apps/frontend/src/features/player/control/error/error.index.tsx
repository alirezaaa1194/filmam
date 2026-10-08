"use client";

import { Warning2 } from "iconsax-react";
import { Button } from "../../../../utilities/components/ui";
import { useRouter } from "next/navigation";
import { CommentEntityTypeEnum } from "../../../../types";

export default function ErrorComp({ entityType, data, dir, setError }: any) {
  const router = useRouter();

  return (
    <main className="relative w-full h-[100svh] bg-gray-14 flex flex-col items-center justify-center gap-6 select-none" dir={dir}>
      <div className="flex flex-col items-center gap-3">
        <div className="size-16 rounded-full bg-error/10 flex items-center justify-center">
          <Warning2 className="size-8 stroke-error" />
        </div>
        <h3 className="text-white text-h-6 font-bold">پخش با خطا مواجه شد</h3>
        <p className="text-gray-8 text-body-xxs text-center max-w-md">متأسفانه در پخش این ویدیو مشکلی پیش آمد. لطفاً دوباره تلاش کنید یا به صفحه‌ی قبل بازگردید.</p>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={() => setError(false)} className="bg-primary hover:bg-primary-shade-1 text-white cursor-pointer h-11 rounded-md px-6">
          تلاش مجدد
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push(entityType === CommentEntityTypeEnum.EPISODE ? `/movies/${data.movie.slug}` : `/movies/${data.slug}`)}
          className="border-white/30 text-white hover:bg-white/10 cursor-pointer h-11 rounded-md px-6"
        >
          بازگشت
        </Button>
      </div>
    </main>
  );
}