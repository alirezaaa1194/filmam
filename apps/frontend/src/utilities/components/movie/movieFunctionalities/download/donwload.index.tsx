import { ImportCurve } from "iconsax-react";
import { Button } from "../../../ui";
import { FileTypeEnum, MovieDetailPublicType, MovieListItemType } from "../../../../../types";

function MovieDownloadFunctionalityComp({ movie }: { movie: MovieDetailPublicType | MovieListItemType }) {
  const movieFilmFile = movie.files.find((file) => file.type === FileTypeEnum.POSTER);

  return (
    <a href={movieFilmFile?.path} download={`${movie.title}`} target="_blank">
      <Button className={`size-9 lg:size-14 rounded-md lg:rounded-lg cursor-pointer bg-white/7! border border-white/10 hover:border-white`}>
        <ImportCurve variant="Outline" className="size-5 lg:size-7 transition-all fill-white" />
      </Button>
    </a>
  );
}

export default MovieDownloadFunctionalityComp;
