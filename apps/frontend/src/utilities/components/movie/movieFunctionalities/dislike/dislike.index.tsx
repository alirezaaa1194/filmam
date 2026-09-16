import { Dislike } from "iconsax-react";
import { Button } from "../../../ui";
import { UserMovieActionType, UserMovieTypeEnum } from "../../../../../types";
import { useMovieAction } from "../movieFunctionalities.script";

function MovieDislikeFunctionalityComp({ movieId, actions }: { movieId: number; actions: UserMovieActionType[] }) {
  const didUserSaved = actions.some((action) => action.type === UserMovieTypeEnum.DISLIKE);
  const { toggleAction } = useMovieAction(movieId, UserMovieTypeEnum.DISLIKE, "نظر شما با موفقیت ثبت شد", "نظر شما با موفقیت ذخیره شد", "خطا در ثبت نظر شما");
  return (
    <Button
      onClick={() =>
        toggleAction({
          movieId,
          isCurrentlySaved: didUserSaved,
        })
      }
      className={`size-9 lg:size-14 rounded-full cursor-pointer ${didUserSaved ? "bg-complementary hover:bg-complementary hover:opacity-80" : "bg-white/7 backdrop-blur-[12px] border border-white/10 hover:border-complementary hover:bg-white/7 hover:[&>svg]:fill-complementary"}`}
    >
      <Dislike variant={didUserSaved ? "Bold" : "Outline"} className="size-4 lg:size-6 transition-all fill-white" />
    </Button>
  );
}

export default MovieDislikeFunctionalityComp;
