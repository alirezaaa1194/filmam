import { ArchiveAdd, ArchiveMinus } from "iconsax-react";
import { Button } from "../../../ui";
import { AuthModeEnum, CommentEntityTypeEnum, UserMovieActionType, UserMovieTypeEnum } from "../../../../../types";
import { useMovieAction } from "../movieFunctionalities.script";
import { use } from "react";
import { UserContext } from "../../../../../contexts";
import { AuthModalContext } from "../../../../../contexts/authModal";

function MovieSaveFunctionalityComp({ movieId, actions, heroLike }: { movieId: number; actions: UserMovieActionType[]; heroLike?: boolean }) {
  const didUserSaved = actions?.some((action) => action.type === UserMovieTypeEnum.BOOKMARK);
  const { toggleAction } = useMovieAction({
    entityId: movieId,
    entityType: CommentEntityTypeEnum.MOVIE,
    type: UserMovieTypeEnum.BOOKMARK,
    successMessage: "به لیست ذخیره‌شده‌ها اضافه شد",
    disSuccessMessage: "از لیست ذخیره‌شده‌ها حذف شد",
    errorMessage: "خطا در تغییر وضعیت ذخیره",
  });

  const user = use(UserContext);
  const { setAuthMode } = use(AuthModalContext);

  return (
    <Button
      onClick={() => {
        if (user) {
          toggleAction({
            entityId: movieId,
            isCurrentlySaved: didUserSaved,
          });
        } else {
          setAuthMode({
            mode: AuthModeEnum.LOGIN,
            callback: async () => {
              toggleAction({
                entityId: movieId,
                isCurrentlySaved: didUserSaved,
              });
            },
          });
        }
      }}
      className={`flex-1 lg:flex-0 h-[46px] lg:size-[46px] rounded-md cursor-pointer border ${heroLike ? "hidden lg:flex" : ""} ${didUserSaved ? "border-primary bg-primary hover:bg-primary/80 hover:border-primary/80" : "bg-white/7 backdrop-blur-[12px] border-white/10 hover:border-primary hover:bg-white/7 hover:[&>svg]:fill-primary"}`}
    >
      {!didUserSaved ? <ArchiveAdd variant={"Outline"} className="size-6 transition-all fill-white" /> : <ArchiveMinus variant={"Outline"} className="size-6 transition-all fill-white" />}
    </Button>
  );
}

export default MovieSaveFunctionalityComp;
