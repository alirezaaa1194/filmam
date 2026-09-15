import { GetTranslation } from "../scripts/server/translation";
import LayoutProvider from "../providers/layoutProvider";
import Header from "../utilities/components/header/header.index";
import Footer from "../utilities/components/footer/footer.index";
import HomePageComp from "../features/home/home.index";
import { Suspense } from "react";
import HeroSectionSkeletonComp from "../utilities/components/sections/hero/skeleton/heroSectionSkeleton.index";
import KidsSectionSkeletonComp from "../utilities/components/sections/kids/skeleton/kidsSectionSkeleton.index";
import NormalSectionSkeletonComp from "../utilities/components/sections/normal/skeleton/normalSectionSkeleton.index";
import RecentWatchSectionSkeletonComp from "../utilities/components/sections/recentWatch/skeleton/recentWatchItemSkeleton.index";
import PuzzleSectionSkeletonComp from "../utilities/components/sections/puzzle/skeleton/puzzleSectionSkeleton.index";
import HeroLikeSectionSkeletonComp from "../utilities/components/sections/heroLike/skeleton/heroLikeSectionSkeleton.index";
export async function generateMetadata() {
  const { t } = await GetTranslation();

  return {
    title: t("HomePage.title"),
  };
}

export default async function HomePage() {
  return (
    <LayoutProvider header={<Header absolute={true} />} footer={<Footer />}>
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
    </LayoutProvider>
  );
}
