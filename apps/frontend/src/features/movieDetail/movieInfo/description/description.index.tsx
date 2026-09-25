import { useState } from "react";
import { MovieDetailPublicType } from "../../../../types";
import MovieAboutComp from "./about/about.index";

function MovieDescriptionComp({ movie }: { movie: MovieDetailPublicType }) {
  const [seeMore, setSeeMore] = useState(false);
  const isDescriptionLong = (movie.description?.length ?? 0) > 200;

  return (
    <section className="px-layout-x-space max-w-layout-max mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        <div className="flex flex-col gap-2 lg:gap-3">
          <h3 className="text-white text-mobile-h-5 lg:text-h-6">داستان {movie.title}</h3>
          <p className={`text-gray-7 text-mobile-body-sm lg:text-body-xs text-justify ${!seeMore ? "line-clamp-4 lg:line-clamp-5" : ""}`}>{movie.description}</p>
          {isDescriptionLong ? (
            <button type="button" onClick={() => setSeeMore((prev) => !prev)} className="self-start cursor-pointer text-primary hover:text-primary-tint-1 text-mobile-button-s lg:text-button-s transition-colors">
              {seeMore ? "کمتر" : "بیشتر..."}
            </button>
          ) : null}
        </div>

        <MovieAboutComp movieTitle={movie.title} movieShortDescription={movie.short_description} />
      </div>
    </section>
  );
}

export default MovieDescriptionComp;
