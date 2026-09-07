"use client";
import HeroSectionComp from "@/utilities/components/sections/hero/hero.index";
import RecentWatchSectionComp from "../../utilities/components/sections/recentWatch/recentWatch.index";
import NormalSliderSectionComp from "../../utilities/components/sections/normal/normal.index";
import HeroLikeSectionComp from "../../utilities/components/sections/heroLike/heroLike.index";
import KidsSectionComp from "../../utilities/components/sections/kids/kids.index";

function HomePageComp() {
  return (
    <main className="pb-10">
      <HeroSectionComp />
      <RecentWatchSectionComp />
      <NormalSliderSectionComp />
      <HeroLikeSectionComp />
      <KidsSectionComp />
    </main>
  );
}

export default HomePageComp;
