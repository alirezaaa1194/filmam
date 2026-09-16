import { Like1 } from "iconsax-react";
import { Button } from "../../../ui";
import { UserMovieActionType, UserMovieTypeEnum } from "../../../../../types";
import { useMovieAction } from "../movieFunctionalities.script";

function MovieLikeFunctionalityComp({ movieId, actions }: { movieId: number; actions: UserMovieActionType[] }) {
  const didUserSaved = actions.some((action) => action.type === UserMovieTypeEnum.LIKE);
  const { toggleAction } = useMovieAction(movieId,UserMovieTypeEnum.LIKE, "نظر شما با موفقیت ثبت شد", "نظر شما با موفقیت ذخیره شد", "خطا در ثبت نظر شما");
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
      <Like1 variant={didUserSaved ? "Bold" : "Outline"} className="size-4 lg:size-6 transition-all fill-white" />
    </Button>
  );
}

export default MovieLikeFunctionalityComp;
