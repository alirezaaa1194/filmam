import { AppApis } from "../../../data";
import { GetTranslation, ServerCall } from "../../../scripts/server";
import { MovieDetailPublicType, MovieTypeEnum } from "../../../types";
import MovieDetailPageComp from "../../../features/movieDetail/movieDetail.index";
import { Suspense } from "react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { t } = await GetTranslation();
  const { slug } = await params;
  const movieData = await ServerCall<MovieDetailPublicType>(AppApis.movie.detail(slug), { method: "GET", ghostMode: true });

  return {
    title: `${movieData.type === MovieTypeEnum.SERIES ? t("Movie.Series") : t("Movie.Film")} ${movieData.title} | ${t("Common.filmam")}`,
    description: movieData.short_description,
  };
}

async function MovieDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <Suspense fallback={"loading2..."}>
      <MovieDetailPageComp slug={slug} />
    </Suspense>
  );
}

export default MovieDetailPage;
