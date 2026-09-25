import { SortTypeEnum } from "../../../../../types";

export type SortEpisodesProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sortValue: SortTypeEnum;
  onSortChange: (value: SortTypeEnum) => void;
  unwatchedEpisodes: boolean;
  onUnwatchedChange: (value: boolean) => void;
};
