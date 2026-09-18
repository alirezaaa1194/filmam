"use client";

import { useState } from "react";
import { ArrowDown2 } from "iconsax-react";
import { CommentEntityTypeEnum, MovieSeasonWithEpisodesType } from "@/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../ui";
import { useQuery } from "@tanstack/react-query";
import { ClientCall } from "../../../../../scripts/client";
import { AppApis } from "../../../../../data";
import { useLocale } from "../../../../../hooks";

export type CommentEntityPickerProps = {
  entityId: number;
  entityType: CommentEntityTypeEnum;
  entitySlug: string;
};

export default function CommentEntityPickerComp({ movieSlug, movieTitle, movieId, commentEntityType, setCommentEntityType }: { movieSlug: string; movieTitle?: string; movieId: number; commentEntityType: CommentEntityPickerProps; setCommentEntityType: (value: CommentEntityPickerProps) => void }) {
  const { locale, t } = useLocale();
  const { data, isPending } = useQuery({
    queryKey: ["movie-episodes", movieSlug, locale],
    queryFn: () =>
      ClientCall<MovieSeasonWithEpisodesType[]>(AppApis.movie.episodes(movieSlug), {
        method: "GET",
        locale,
      }),
  });

  const [open, setOpen] = useState(false);
  const isMovieSelected = commentEntityType.entityType === CommentEntityTypeEnum.MOVIE;
  const selectedSeason = data?.find((season) => season.episodes.some((ep) => ep.slug === commentEntityType.entitySlug));
  const [accordionValue, setAccordionValue] = useState<string>(selectedSeason ? String(selectedSeason.id) : "");
  const selectedLabel = isMovieSelected ? movieTitle || "فیلم" : (data?.flatMap((season) => season.episodes).find((ep) => ep.slug === commentEntityType.entitySlug)?.title ?? "انتخاب کنید");

  if (isPending) return "loading...";

  const hasSingleSeason = data?.length === 1;
  const singleSeason = hasSingleSeason ? data[0] : null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="group outline-none cursor-pointer text-gray-9 flex items-center justify-between gap-2 px-3 py-1.5 rounded-md border border-gray-9 hover:border-primary transition-all min-w-40 max-w-fit">
        {selectedLabel}
        <ArrowDown2 className={`size-4 stroke-gray-9 transition-all ${open ? "rotate-180" : ""}`} />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="!mt-1 !p-3 w-fit min-w-56 max-w-80 bg-gray-13 border border-gray-12 rounded-lg flex flex-col gap-2" align="start">
        <DropdownMenuItem
          onClick={() => {
            setCommentEntityType({
              entityId: movieId,
              entityType: CommentEntityTypeEnum.MOVIE,
              entitySlug: movieSlug,
            });
            setAccordionValue("");
            setOpen(false);
          }}
          className={`cursor-pointer flex items-center rounded-md ${isMovieSelected ? "bg-primary hover:bg-primary/80" : "hover:bg-gray-12"}`}
        >
          {movieTitle}
        </DropdownMenuItem>

        {hasSingleSeason && singleSeason ? (
          <div className="flex flex-col gap-1">
            {singleSeason.episodes.length > 0 ? (
              singleSeason.episodes.map((episode) => (
                <button
                  key={episode.id}
                  onClick={() => {
                    setCommentEntityType({
                      entityId: episode.id,
                      entityType: CommentEntityTypeEnum.EPISODE,
                      entitySlug: episode.slug,
                    });
                    setOpen(false);
                  }}
                  className={`w-full text-right px-2 py-1.5 text-sm rounded-md cursor-pointer flex items-center justify-between whitespace-nowrap ${commentEntityType.entitySlug === episode.slug ? "bg-primary hover:bg-primary/80" : "bg-gray-13 hover:bg-gray-12"}`}
                >
                  {t("RecentWatch.episode")} {episode.order}
                </button>
              ))
            ) : (
              <div className="w-full text-right px-2 py-1.5 text-sm rounded-md text-gray-9 bg-gray-12/50 select-none whitespace-nowrap">قسمتی ندارد</div>
            )}
          </div>
        ) : (
          <Accordion type="single" collapsible value={accordionValue} onValueChange={setAccordionValue}>
            {data?.map((season) => {
              const hasEpisodes = season.episodes.length > 0;

              return (
                <AccordionItem value={String(season.id)} className="border-0!" key={season.id}>
                  <AccordionTrigger className={`group px-2 py-1.5 text-sm rounded-md justify-between hover:bg-gray-12! hover:no-underline cursor-pointer data-[state=open]:bg-gray-12 ${!hasEpisodes ? "opacity-50 pointer-events-none cursor-not-allowed" : ""}`} showIcon={false} onClick={(e) => e.stopPropagation()} disabled={!hasEpisodes}>
                    <span className="whitespace-nowrap">{season.title}</span>
                    {hasEpisodes ? <ArrowDown2 variant="Outline" className="stroke-[#fff] size-3 shrink-0 transition-all group-data-[state=open]:rotate-180" /> : null}
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 pt-1 ps-3 space-y-1 h-fit">
                    {hasEpisodes ? (
                      season.episodes.map((episode) => (
                        <button
                          key={episode.id}
                          onClick={() => {
                            setCommentEntityType({
                              entityId: episode.id,
                              entityType: CommentEntityTypeEnum.EPISODE,
                              entitySlug: episode.slug,
                            });
                            setOpen(false);
                          }}
                          className={`w-full text-right px-2 py-1.5 text-sm rounded-md cursor-pointer flex items-center justify-between whitespace-nowrap ${commentEntityType.entitySlug === episode.slug ? "bg-primary hover:bg-primary/80" : "bg-gray-13 hover:bg-gray-12"}`}
                        >
                          {t("RecentWatch.episode")} {episode.order}
                        </button>
                      ))
                    ) : (
                      <div className="w-full text-right px-2 py-1.5 text-sm rounded-md text-gray-9 bg-gray-12/50 select-none whitespace-nowrap">قسمتی ندارد</div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
