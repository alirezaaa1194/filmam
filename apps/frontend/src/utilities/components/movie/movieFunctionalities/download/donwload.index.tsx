import { ImportCurve } from "iconsax-react";
import { Button } from "../../../ui";
import { FileTypeEnum, MovieDetailPublicType, MovieListItemType } from "../../../../../types";

function MovieDownloadFunctionalityComp({ movie, className }: { movie: MovieDetailPublicType | MovieListItemType; className?: string }) {
  const movieFilmFile = movie.files.find((file) => file.type === FileTypeEnum.POSTER);

  return (
    <Button asChild className={`flex flex-1 lg:ms-auto lg:flex-0 h-[46px] lg:size-[46px] rounded-md cursor-pointer bg-white/7! border border-white/10 hover:border-white ${className}`}>
      <a href={movieFilmFile?.path} download={movie.title} target="_blank">
        <ImportCurve variant="Outline" className="size-6 transition-all fill-white" />
      </a>
    </Button>
  );
}

export default MovieDownloadFunctionalityComp;
