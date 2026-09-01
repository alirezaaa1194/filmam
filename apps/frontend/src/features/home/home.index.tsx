"use client";
import HeroSectionComp from "@/utilities/components/sections/hero/hero.index";
import RecentWatchSectionComp from "../../utilities/components/sections/recentWatch/recentWatch.index";
import NormalSliderSectionComp from "../../utilities/components/sections/normal/normal.index";

function HomePageComp() {
  return (
    <main className="pb-10">
      <HeroSectionComp />
      <RecentWatchSectionComp />
      <NormalSliderSectionComp />
    </main>
  );
}

export default HomePageComp;
