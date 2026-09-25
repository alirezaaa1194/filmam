import { ReactNode } from "react";

export type EmptyStateVariant = "noEpisodes" | "allWatched" | "noSeasons";

export type SeasonsEmptyStateCompProps = {
  variant?: EmptyStateVariant;
  title: string;
  description: string;
  action?: ReactNode;
};
