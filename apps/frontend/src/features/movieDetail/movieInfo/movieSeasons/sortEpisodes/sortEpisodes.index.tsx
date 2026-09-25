import { Sort } from "iconsax-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Separator, Switch } from "@/utilities/components/ui";
import { SortEpisodesProps } from "./sortEpisodes.type";
import { SortTypeEnum } from "../../../../../types";

function SortEpisodesComp({ open, onOpenChange, sortValue, onSortChange, unwatchedEpisodes, onUnwatchedChange }: SortEpisodesProps) {
  const itemClass = (active: boolean) => `bg-transparent transition-all ${active ? "bg-primary hover:bg-primary/80 rounded-md" : "hover:bg-gray-12"} cursor-pointer`;

  return (
    <DropdownMenu onOpenChange={onOpenChange} open={open}>
      <DropdownMenuTrigger className="outline-none cursor-pointer text-gray-7 flex items-center gap-2 text-mobile-button-md lg:text-button-md">
        <Sort className="size-5 lg:size-6 stroke-gray-7" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="!mt-1 !p-3 w-[182px] bg-gray-13 border border-gray-12 rounded-lg flex flex-col gap-2">
        <DropdownMenuItem onClick={() => onSortChange(SortTypeEnum.ASC)} className={itemClass(sortValue === SortTypeEnum.ASC)}>
          صعودی
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSortChange(SortTypeEnum.DESC)} className={itemClass(sortValue === SortTypeEnum.DESC)}>
          نزولی
        </DropdownMenuItem>
        <Separator className="bg-gray-12" />
        <DropdownMenuItem className="flex items-center justify-between">
          مشاهده نشده
          <Switch checked={unwatchedEpisodes} onCheckedChange={onUnwatchedChange} dir="ltr" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default SortEpisodesComp;
