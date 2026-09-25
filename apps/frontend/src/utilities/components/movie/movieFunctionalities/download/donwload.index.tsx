import { ImportCurve } from "iconsax-react";
import { Button } from "../../../ui";
import { FileTypeEnum, MovieDetailPublicType, MovieListItemType } from "../../../../../types";

function MovieDownloadFunctionalityComp({ movie, className }: { movie: MovieDetailPublicType | MovieListItemType; className?: string }) {
  const movieFilmFile = movie.files.find((file) => file.type === FileTypeEnum.POSTER);

  return (
    <a href={movieFilmFile?.path} download={`${movie.title}`} target="_blank" className={className}>
      <Button className={`w-full h-[46px] lg:size-[46px] rounded-md cursor-pointer bg-white/7! border border-white/10 hover:border-white`}>
        <ImportCurve variant="Outline" className="size-6 transition-all fill-white" />
      </Button>
    </a>
  );
}

export default MovieDownloadFunctionalityComp;
