import { dehydrate, HydrationBoundary, noop } from "@tanstack/react-query";
import { getQueryClient } from "../../lib/getQueryClient";
import { GetLocale, ServerCall } from "../../scripts/server";
import HomeSectionsComp from "./sections/sections.index";
import { sectionsInfiniteOptions } from "./home.script";

async function HomePageComp() {
  const locale = await GetLocale();
  const queryClient = getQueryClient();
  await queryClient.infiniteQuery(sectionsInfiniteOptions(locale, ServerCall)).catch(noop);

  return (
    <main className="pb-10">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HomeSectionsComp />
      </HydrationBoundary>
    </main>
  );
}

export default HomePageComp;
