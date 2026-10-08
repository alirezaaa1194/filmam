"use client";

import { Button, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../../../utilities/components/ui";
import { TimerParser } from "../../../../../scripts";
import { CommentEntityTypeEnum, UserMovieTypeEnum } from "../../../../../types";
import { useSaveWatchTime } from "../../../player.script";

export default function ResumeModalComp({ open, setOpen, savedProgress, data, entityType, dir, videoRef }: any) {
  const { mutate: saveWatchTime } = useSaveWatchTime();

  return (
    <Dialog
      open={open}
      onOpenChange={(o: boolean) => {
        setOpen(o);
        if (!o) videoRef.current?.play().catch(() => {});
      }}
    >
      <DialogContent showHeader={false} className="bg-gray-14/95 backdrop-blur-[20px] border-white/20 text-white max-w-md p-6" dir={dir}>
        <DialogHeader>
          <DialogTitle className="text-white">ادامه‌ی تماشا</DialogTitle>
          <DialogDescription className="text-white/70">شما قبلاً این ویدیو را تا {TimerParser(Math.floor(savedProgress), true)} تماشا کرده‌اید. از کجا ادامه می‌دهید؟</DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 mt-8">
          <Button
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.currentTime = savedProgress;
                videoRef.current.play().catch(() => {});
              }
              setOpen(false);
            }}
            className="bg-primary hover:bg-primary-shade-1 text-white cursor-pointer h-10 rounded-md flex-1"
          >
            ادامه از {TimerParser(Math.floor(savedProgress), true)}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play().catch(() => {});
              }
              saveWatchTime({ entityId: data.id, entityType, progressTime: 0, type: UserMovieTypeEnum.WATCHING });
              setOpen(false);
            }}
            className="border-white/30 text-white hover:bg-white/10 cursor-pointer h-10 rounded-md flex-1"
          >
            شروع از ابتدا
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
