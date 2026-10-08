import { MovieDetailPublicType } from "@/types";

export type PlayerEpisodesModalProps = {
  movie: MovieDetailPublicType;
  activeEpisodeId: number;
  activeSeasonSlug: string;
  onOpenChange?: (open: boolean) => void;
};
