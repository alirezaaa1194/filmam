import { Dislike } from "iconsax-react";
import { Button } from "../../../ui";
import { AuthModeEnum, UserMovieActionType, UserMovieTypeEnum } from "../../../../../types";
import { useMovieAction } from "../movieFunctionalities.script";
import { use } from "react";
import { UserContext } from "../../../../../contexts";
import { AuthModalContext } from "../../../../../contexts/authModal";

function MovieDislikeFunctionalityComp({ movieId, actions }: { movieId: number; actions: UserMovieActionType[] }) {
  const didUserSaved = actions.some((action) => action.type === UserMovieTypeEnum.DISLIKE);
  const { toggleAction } = useMovieAction(movieId, UserMovieTypeEnum.DISLIKE, "نظر شما با موفقیت ثبت شد", "نظر شما با موفقیت ذخیره شد", "خطا در ثبت نظر شما");
  const user = use(UserContext);
  const { setAuthMode } = use(AuthModalContext);

  return (
    <Button
      onClick={() => {
        if (user) {
          toggleAction({
            movieId,
            isCurrentlySaved: didUserSaved,
          });
        } else {
          setAuthMode({
            mode: AuthModeEnum.LOGIN,
            callback: async () => {
              toggleAction({
                movieId,
                isCurrentlySaved: didUserSaved,
              });
            },
          });
        }
      }}
      className={`size-9 lg:size-14 rounded-md lg:rounded-lg cursor-pointer border ${didUserSaved ? "border-complementary bg-complementary hover:bg-complementary/80 hover:border-complementary/80" : "bg-white/7 backdrop-blur-[12px] border-white/10 hover:border-complementary hover:bg-white/7 hover:[&>svg]:fill-complementary"}`}
    >
      <Dislike variant={didUserSaved ? "Bold" : "Outline"} className="size-5 lg:size-7 transition-all fill-white" />
    </Button>
  );
}

export default MovieDislikeFunctionalityComp;
