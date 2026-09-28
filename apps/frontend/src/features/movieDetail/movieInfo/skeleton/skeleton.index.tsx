import { CommentSectionSkeletonComp } from "../comment/skeleton/skeleton.index";
import { MovieDescriptionSkeletonComp } from "../description/skeleton/skeleton.index";
import EpisodeFactorsSkeletonComp from "../factors/skeleton/skeleton.index";
import { MovieInformationTableSkeletonComp } from "../informationTable/skeleton/skeleton.index";
import MovieHeaderSkeletonComp from "../movieHeader/skeleton/skeleton.index";
import MovieSeasonsSkeletonComp from "../movieSeasons/skeleton/skeleton.indrx";
import SuggestionMoviesSectionSkeleton from "../suggestionMovies/skeleton/skeleton.index";

function MovieInfoSkeletonComp() {
  return (
    <main className="flex flex-col gap-6 lg:gap-9">
      <MovieHeaderSkeletonComp />
      <MovieSeasonsSkeletonComp />
      <EpisodeFactorsSkeletonComp />
      <CommentSectionSkeletonComp />
      <MovieInformationTableSkeletonComp />
      <MovieDescriptionSkeletonComp />
      <SuggestionMoviesSectionSkeleton />
    </main>
  );
}

export default MovieInfoSkeletonComp;
