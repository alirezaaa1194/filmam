"use client";

import { useQuery } from "@tanstack/react-query";
import { movieDetailQueryOptions } from "../movieDetail.script";
import { useLocale } from "../../../hooks";
import { ClientCall } from "../../../scripts/client";
import MovieHeaderComp from "./movieHeader/movieHeader.index";
import MovieSeasonsComp from "./movieSeasons.index";
import { MovieTypeEnum } from "../../../types";
import EpisodeFactorsComp from "./factors/factors.index";
import SuggestionMoviesComp from "./suggestionMovies/suggestionMovies.index";
import CommentSectionComp from "../../../utilities/components/movie/comment/comment.index";

function MovieDetailInfoComp({ slug }: { slug: string }) {
  const { locale } = useLocale();
  const { data: movie, isPending: movieIsPending } = useQuery(movieDetailQueryOptions(locale, slug, ClientCall));

  if (movieIsPending || !movie) {
    return;
  }

  return (
    <main>
      <MovieHeaderComp movie={movie} />
      {movie.type === MovieTypeEnum.SERIES ? <MovieSeasonsComp movie={movie} /> : null}
      <EpisodeFactorsComp movie={movie} />
      <CommentSectionComp />
      <SuggestionMoviesComp slug={slug} />
    </main>
  );
}

export default MovieDetailInfoComp;
