"use client";

import { useQuery } from "@tanstack/react-query";
import { movieDetailQueryOptions } from "../movieDetail.script";
import { useLocale } from "../../../hooks";
import { ClientCall } from "../../../scripts/client";
import MovieHeaderComp from "./movieHeader/movieHeader.index";
import MovieSeasonsComp from "./movieSeasons/movieSeasons.index";
import { CommentEntityTypeEnum, MovieTypeEnum } from "../../../types";
import EpisodeFactorsComp from "./factors/factors.index";
import SuggestionMoviesComp from "./suggestionMovies/suggestionMovies.index";
import CommentSectionComp from "../../../utilities/components/movie/comment/comment.index";
import MovieDescriptionComp from "./description/description.index";
import MovieInformationTable from "./informationTable/informationTable.index";

function MovieDetailInfoComp({ slug }: { slug: string }) {
  const { locale } = useLocale();
  const { data: movie, isPending: movieIsPending } = useQuery(movieDetailQueryOptions(locale, slug, ClientCall));

  if (movieIsPending || !movie) {
    return;
  }

  return (
    <main className="flex flex-col gap-6 lg:gap-9">
      <MovieHeaderComp movie={movie} />
      <MovieDescriptionComp movie={movie} />
      <MovieInformationTable movie={movie} />
      {movie.type === MovieTypeEnum.SERIES ? <MovieSeasonsComp movie={movie} /> : null}
      <EpisodeFactorsComp movie={movie} />
      <CommentSectionComp movie={movie} entitySlug={slug} entityId={movie.id} entityType={CommentEntityTypeEnum.MOVIE} movieTitle={movie.title} />
      <SuggestionMoviesComp slug={slug} />
    </main>
  );
}

export default MovieDetailInfoComp;
