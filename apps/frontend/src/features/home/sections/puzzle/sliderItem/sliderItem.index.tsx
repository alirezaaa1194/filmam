import Image from "next/image";
import { FileTypeEnum, MovieListItemType } from "../../../../../types";

function PuzzleSliderItemComp({ movie }: { movie: MovieListItemType }) {
  const movieThumbnail = movie.files.find((file) => file.type === FileTypeEnum.THUMBNAIL);
  const placeholderPath = "/images/placeholder-h.jpg";

  return (
    <div className="w-full h-full">
      <Image src={movieThumbnail?.path || placeholderPath} width={669} height={370} alt={movieThumbnail?.alt_text || movie.title} className="w-full h-full object-cover object-top rounded-xl max-h-[370px]" />
      <div className="absolute inset-x-0 bottom-0 w-full lg:min-h-14 bg-black/30 backdrop-blur-[10px] z-10 rounded-b-xl flex items-center justify-baseline p-3">
        <h6 className="text-h-6 text-white">{movie.title}</h6>
      </div>
    </div>
  );
}

export default PuzzleSliderItemComp;
