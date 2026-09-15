import { dehydrate, HydrationBoundary, noop } from "@tanstack/react-query";
import { getQueryClient } from "../../lib/getQueryClient";
import { GetLocale, ServerCall } from "../../scripts/server";
import { movieDetailQueryOptions } from "./movieDetail.script";
import MovieDetailInfoComp from "./movieInfo/movieInfo.index";
import { notFound } from "next/navigation";

async function MovieDetailPageComp({ slug }: { slug: string }) {
  const locale = await GetLocale();
  const queryClient = getQueryClient();
  const movie = await queryClient.query(movieDetailQueryOptions(locale, slug, ServerCall)).catch(noop);
  if (!movie) {
    notFound();
  }
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MovieDetailInfoComp slug={slug} />
    </HydrationBoundary>
  );
}

export default MovieDetailPageComp;
