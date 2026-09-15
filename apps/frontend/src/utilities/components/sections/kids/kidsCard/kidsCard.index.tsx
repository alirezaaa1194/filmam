import Image from "next/image";
import { __MovieListItemType } from "../../../../../types/general";
import { FileTypeEnum } from "../../../../../types";

function KidCardComp({ movie }: { movie: __MovieListItemType }) {
  const movieThumbnail = movie.files.find((file) => file.type === FileTypeEnum.THUMBNAIL);
  const placeholderPath = "/images/placeholder-v.jpg";

  return (
    <div className="relative rounded-xl select-none h-[400px] xl:h-[480px]">
      <Image draggable={false} src={movieThumbnail?.path || placeholderPath} width={300} height={482} alt={movieThumbnail?.alt_text || movie.title} className="w-full h-full object-cover rounded-xl bg-gray-11" />
      <div className="absolute bottom-0 left-0 w-full bg-black/70 backdrop-blur-[10px] flex items-center justify-center p-3 rounded-b-md lg:rounded-b-xl">
        <span className="text-white text-caption-md">{movie.title}</span>
      </div>
      <div className="pointer-events-none absolute inset-0 z-20 rounded-xl border border-gray-10" />
    </div>
  );
}

export default KidCardComp;
