"use client";
import HeroSectionComp from "@/utilities/components/sections/hero/hero.index";
import RecentWatchSectionComp from "@/utilities/components/sections/recentWatch/recentWatch.index";
import { useInfiniteQuery } from "@tanstack/react-query";
import { sectionsInfiniteOptions } from "../home.script";
import { useLocale } from "../../../hooks";
import { useEffect, useRef } from "react";
import { Spinner } from "../../../utilities/components/ui";
import { ClientCall } from "../../../scripts/client";
import { SectionSelectionModeEnum, SectionType, SectionViewModeEnum } from "../../../types";
import NormalSliderSectionComp from "../../../utilities/components/sections/normal/normal.index";
import HeroLikeSectionComp from "../../../utilities/components/sections/heroLike/heroLike.index";
import KidsSectionComp from "../../../utilities/components/sections/kids/kids.index";
import PuzzleSectionComp from "../../../utilities/components/sections/puzzle/puzzle.index";

function HomeSectionsComp() {
  const { locale } = useLocale();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(sectionsInfiniteOptions(locale, ClientCall));
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "0px 0px 500px 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      {data?.pages.map((page: any) => page.data.filter((section: SectionType) => section.movies.length).map((section: SectionType) => (section.view_mode === SectionViewModeEnum.HERO ? <HeroSectionComp key={section.id} section={section} /> : section.selection_mode === SectionSelectionModeEnum.USER_MOVIE ? <RecentWatchSectionComp key={section.id} section={section} /> : section.view_mode === SectionViewModeEnum.NORMAL_SLIDER ? <NormalSliderSectionComp key={section.id} section={section} /> : section.view_mode === SectionViewModeEnum.HERO_LIKE_SLIDER ? <HeroLikeSectionComp key={section.id} section={section} /> : section.view_mode === SectionViewModeEnum.KIDS_SLIDER ? <KidsSectionComp key={section.id} section={section} /> : section.view_mode === SectionViewModeEnum.PUZZLE ? <PuzzleSectionComp key={section.id} section={section} /> : null)))}

      <div ref={loadMoreRef} />

      {isFetchingNextPage && <Spinner />}
    </>
  );
}

export default HomeSectionsComp;
