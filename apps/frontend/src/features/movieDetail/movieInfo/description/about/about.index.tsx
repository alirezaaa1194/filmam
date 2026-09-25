import { useState } from "react";

function MovieAboutComp({ movieTitle, movieShortDescription }: { movieTitle: string; movieShortDescription: string }) {
  const [seeMore, setSeeMore] = useState(false);
  const isDescriptionLong = (movieShortDescription.length ?? 0) > 200;

  return (
    <div className="flex flex-col gap-2 lg:gap-3">
      <h3 className="text-white text-mobile-h-5 lg:text-h-6">درباره {movieTitle}</h3>
      <p className={`text-gray-7 text-mobile-body-sm lg:text-body-xs text-justify ${!seeMore ? "line-clamp-4 lg:line-clamp-5" : ""}`}>{movieShortDescription}</p>
      {isDescriptionLong ? (
        <button type="button" onClick={() => setSeeMore((prev) => !prev)} className="self-start cursor-pointer text-primary hover:text-primary-tint-1 text-mobile-button-s lg:text-button-s transition-colors">
          {seeMore ? "کمتر" : "بیشتر..."}
        </button>
      ) : null}
    </div>
  );
}

export default MovieAboutComp;
