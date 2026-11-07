"use client";

import { useState } from "react";
import { ArrowDown2 } from "iconsax-react";
import { X } from "lucide-react";
import { Button, Drawer, DrawerClose, DrawerContent, DrawerHandle, DrawerHeader, DrawerTitle, Popover, PopoverContent, PopoverTrigger } from "@/utilities/components/ui";

export default function FilterField({ title, summary, mobile, children }: { title: string; summary: string; mobile: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const selected = summary !== title;
  const trigger = (
    <Button type="button" variant="outline" aria-expanded={open} onClick={mobile ? () => setOpen(true) : undefined} className={`h-11 w-full min-w-0 cursor-pointer justify-between gap-2 rounded-md border bg-gray-13 px-3 text-sm text-gray-3 hover:bg-gray-13 hover:text-white ${selected ? "border-primary ring-1 ring-inset ring-primary" : "border-gray-10 hover:border-gray-8"}`}>
      <span className="min-w-0 flex-1 truncate text-start text-xs font-semibold text-white">{summary}</span>
      <ArrowDown2 className="size-4 shrink-0 text-white stroke-white" />
    </Button>
  );

  if (mobile) {
    return (
      <>
        <div className="w-full">{trigger}</div>
        <Drawer open={open} onOpenChange={setOpen} direction="bottom">
          <DrawerContent className="h-[86dvh] min-h-[75dvh] max-h-[92dvh] gap-0 rounded-t-md !border-0 bg-gray-13 p-0 text-white">
            <DrawerHandle />
            <DrawerHeader className="flex-row items-center justify-between border-b border-gray-11 px-5 py-4 text-start">
              <DrawerTitle className="text-white">{title}</DrawerTitle>
              <DrawerClose asChild><Button type="button" variant="ghost" size="icon-sm" aria-label={title} className="cursor-pointer"><X className="size-4" /></Button></DrawerClose>
            </DrawerHeader>
            <div data-drawer-scroll className="flex-1 self-stretch overflow-y-auto bg-gray-13 px-5 py-4">{children}</div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="start" className="w-[min(360px,calc(100vw-32px))] rounded-md border border-gray-10 bg-gray-13 p-4">{children}</PopoverContent>
    </Popover>
  );
}
