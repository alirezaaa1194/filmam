"use client";

import { useQuery } from "@tanstack/react-query";
import { movieDetailQueryOptions } from "../movieDetail.script";
import { useLocale } from "../../../hooks";
import { ClientCall } from "../../../scripts/client";
import MovieHeaderComp from "./movieHeader/movieHeader.index";
import MovieSeasonsComp from "./movieSeasons/movieSeasons.index";
import { MovieTypeEnum } from "../../../types";
import EpisodeFactorsComp from "./factors/factors.index";
import SuggestionMoviesComp from "./suggestionMovies/suggestionMovies.index";
import MovieDescriptionComp from "./description/description.index";
import MovieInformationTable from "./informationTable/informationTable.index";
import CommentSectionComp from "./comment/comment.index";
import MovieInfoSkeletonComp from "./skeleton/skeleton.index";

function MovieDetailInfoComp({ slug }: { slug: string }) {
  const { locale } = useLocale();
  const { data: movie, isPending: movieIsPending } = useQuery(movieDetailQueryOptions(locale, slug, ClientCall));

  if (movieIsPending || !movie) {
    return <MovieInfoSkeletonComp />;
  }

  return (
    <main className="flex flex-col gap-6 lg:gap-9">
      <MovieHeaderComp movie={movie} />
      {movie.type === MovieTypeEnum.SERIES ? <MovieSeasonsComp movie={movie} /> : null}
      <EpisodeFactorsComp movie={movie} />
      <CommentSectionComp movie={movie} />
      <MovieInformationTable movie={movie} />
      <MovieDescriptionComp movie={movie} />
      <SuggestionMoviesComp slug={slug} />
    </main>
  );
}

export default MovieDetailInfoComp;
