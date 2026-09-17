"use client";
import HeroSectionComp from "@/features/home/sections/hero/hero.index";
import RecentWatchSectionComp from "@/features/home/sections/recentWatch/recentWatch.index";
import { useInfiniteQuery } from "@tanstack/react-query";
import { sectionsInfiniteOptions } from "../home.script";
import { useLocale } from "../../../hooks";
import { useEffect, useRef } from "react";
import { ClientCall } from "../../../scripts/client";
import { SectionSelectionModeEnum, SectionType, SectionViewModeEnum } from "../../../types";
import NormalSliderSectionComp from "./normal/normal.index";
import HeroLikeSectionComp from "./heroLike/heroLike.index";
import KidsSectionComp from "./kids/kids.index";
import PuzzleSectionComp from "./puzzle/puzzle.index";
import RecentWatchSectionSkeletonComp from "./recentWatch/skeleton/recentWatchItemSkeleton.index";
import NormalSectionSkeletonComp from "./normal/skeleton/normalSectionSkeleton.index";
import HeroLikeSectionSkeletonComp from "./heroLike/skeleton/heroLikeSectionSkeleton.index";
import KidsSectionSkeletonComp from "./kids/skeleton/kidsSectionSkeleton.index";
import PuzzleSectionSkeletonComp from "./puzzle/skeleton/puzzleSectionSkeleton.index";

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
      {data?.pages.map((page: any) => page.data.filter((section: SectionType) => section && section?.movies?.length).map((section: SectionType) => (section.view_mode === SectionViewModeEnum.HERO ? <HeroSectionComp key={section.id} section={section} /> : section.selection_mode === SectionSelectionModeEnum.USER_MOVIE ? <RecentWatchSectionComp key={section.id} section={section} /> : section.view_mode === SectionViewModeEnum.NORMAL_SLIDER ? <NormalSliderSectionComp key={section.id} section={section} /> : section.view_mode === SectionViewModeEnum.HERO_LIKE_SLIDER ? <HeroLikeSectionComp key={section.id} section={section} /> : section.view_mode === SectionViewModeEnum.KIDS_SLIDER ? <KidsSectionComp key={section.id} section={section} /> : section.view_mode === SectionViewModeEnum.PUZZLE ? <PuzzleSectionComp key={section.id} section={section} /> : null)))}

      <div ref={loadMoreRef} />

      {isFetchingNextPage && (
        <>
          <RecentWatchSectionSkeletonComp />
          <NormalSectionSkeletonComp />
          <HeroLikeSectionSkeletonComp />
          <KidsSectionSkeletonComp />
          <PuzzleSectionSkeletonComp />
        </>
      )}
    </>
  );
}

export default HomeSectionsComp;
