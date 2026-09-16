import { ArchiveAdd } from "iconsax-react";
import { Button } from "../../../ui";
import { UserMovieActionType, UserMovieTypeEnum } from "../../../../../types";
import { useMovieAction } from "../movieFunctionalities.script";

function MovieSaveFunctionalityComp({ movieId, actions }: { movieId: number; actions: UserMovieActionType[] }) {
  const didUserSaved = actions.some((action) => action.type === UserMovieTypeEnum.BOOKMARK);
  const { toggleAction } = useMovieAction(movieId,UserMovieTypeEnum.BOOKMARK, "به لیست ذخیره‌شده‌ها اضافه شد", "از لیست ذخیره‌شده‌ها حذف شد", "خطا در تغییر وضعیت ذخیره");

  return (
    <Button
      onClick={() =>
        toggleAction({
          movieId,
          isCurrentlySaved: didUserSaved,
        })
      }
      className={`size-9 lg:size-14 rounded-full cursor-pointer ${didUserSaved ? "bg-primary hover:bg-primary hover:opacity-80" : "bg-white/7 backdrop-blur-[12px] border border-white/10 hover:border-primary hover:bg-white/7 hover:[&>svg]:fill-primary"}`}
    >
      <ArchiveAdd variant={didUserSaved ? "Bold" : "Outline"} className="size-4 lg:size-6 transition-all fill-white" />
    </Button>
  );
}

export default MovieSaveFunctionalityComp;
