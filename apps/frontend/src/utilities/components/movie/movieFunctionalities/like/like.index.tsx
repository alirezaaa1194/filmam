import { Like1 } from "iconsax-react";
import { Button } from "../../../ui";
import { AuthModeEnum, UserMovieActionType, UserMovieTypeEnum } from "../../../../../types";
import { useMovieAction } from "../movieFunctionalities.script";
import { use } from "react";
import { UserContext } from "../../../../../contexts";
import { AuthModalContext } from "../../../../../contexts/authModal";

function MovieLikeFunctionalityComp({ movieId, actions }: { movieId: number; actions: UserMovieActionType[] }) {
  const didUserSaved = actions.some((action) => action.type === UserMovieTypeEnum.LIKE);
  const { toggleAction } = useMovieAction(movieId, UserMovieTypeEnum.LIKE, "نظر شما با موفقیت ثبت شد", "نظر شما با موفقیت ذخیره شد", "خطا در ثبت نظر شما");
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
      className={`flex-1 lg:flex-0 h-[46px] lg:size-[46px] rounded-md cursor-pointer border ${didUserSaved ? "border-primary bg-primary hover:bg-primary/80 hover:border-primary/80" : "bg-white/7 backdrop-blur-[12px] border-white/10 hover:border-primary hover:bg-white/7 hover:[&>svg]:fill-primary"}`}
    >
      <Like1 variant={didUserSaved ? "Bold" : "Outline"} className="size-6 transition-all fill-white" />
    </Button>
  );
}

export default MovieLikeFunctionalityComp;
