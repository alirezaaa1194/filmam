import { GetTranslation } from "../scripts/server/translation";
import HomePageComp from "../features/home/home.index";
import { Suspense } from "react";
import HeroSectionSkeletonComp from "../features/home/sections/hero/skeleton/heroSectionSkeleton.index";
import KidsSectionSkeletonComp from "../features/home/sections/kids/skeleton/kidsSectionSkeleton.index";
import NormalSectionSkeletonComp from "../features/home/sections/normal/skeleton/normalSectionSkeleton.index";
import RecentWatchSectionSkeletonComp from "../features/home/sections/recentWatch/skeleton/recentWatchItemSkeleton.index";
import PuzzleSectionSkeletonComp from "../features/home/sections/puzzle/skeleton/puzzleSectionSkeleton.index";
import HeroLikeSectionSkeletonComp from "../features/home/sections/heroLike/skeleton/heroLikeSectionSkeleton.index";
export async function generateMetadata() {
  const { t } = await GetTranslation();

  return {
    title: `${t("HomePage.title")} | ${t("Common.filmam")}`,
  };
}

export default async function HomePage() {
  return (
    <Suspense
      fallback={
        <>
          <HeroSectionSkeletonComp />
          <RecentWatchSectionSkeletonComp />
          <NormalSectionSkeletonComp />
          <HeroLikeSectionSkeletonComp />
          <KidsSectionSkeletonComp />
          <PuzzleSectionSkeletonComp />
        </>
      }
    >
      <HomePageComp />
    </Suspense>
  );
}
