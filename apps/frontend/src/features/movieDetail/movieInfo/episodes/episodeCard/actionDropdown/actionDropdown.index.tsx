import { MoreVertical } from "lucide-react";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../../../utilities/components/ui";
import { useEpisodeAction } from "../episodeCard.script";
import { AuthModeEnum, SeasonEpisodeUserMovieType, UserMovieTypeEnum } from "../../../../../../types";
import { use } from "react";
import { UserContext } from "../../../../../../contexts";
import { AuthModalContext } from "../../../../../../contexts/authModal";
import { Archive } from "iconsax-react";

function EpisodeActionDropdownComp({ episodeId, seasonSlug, userMovies }: { episodeId: number; seasonSlug: string; userMovies: SeasonEpisodeUserMovieType[] }) {
  const user = use(UserContext);
  const { setAuthMode } = use(AuthModalContext);
  const { toggleEpisodeAction: saveToggleEpisodeAction } = useEpisodeAction(seasonSlug, UserMovieTypeEnum.BOOKMARK, "نظر شما با موفقیت ثبت شد", "نظر شما با موفقیت ذخیره شد", "خطا در ثبت نظر شما");
  const isCurrentlySaved = userMovies.some((item) => item.type === UserMovieTypeEnum.BOOKMARK);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button className="size-7 rounded-full bg-gray-13 hover:bg-gray-12 cursor-pointer">
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="!mt-1 !p-1  bg-gray-12 border border-gray-11 rounded-lg gap-1">
        <DropdownMenuItem
          className="w-full rounded-md bg-gray-12 hover:bg-gray-11 justify-start cursor-pointer text-caption-md! gap-1"
          onClick={() => {
            if (user) {
              saveToggleEpisodeAction({ episodeId, isCurrentlySaved: isCurrentlySaved });
            } else {
              setAuthMode({
                mode: AuthModeEnum.LOGIN,
                callback: () => {
                  saveToggleEpisodeAction({ episodeId, isCurrentlySaved: isCurrentlySaved });
                },
              });
            }
          }}
        >
          <Archive className="size-4 fill-white" variant={isCurrentlySaved ? "Bold" : "Outline"} />
          {isCurrentlySaved ? "حذف از لیست ذخیره ها" : "افزودن به لیست ذخیره ها"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default EpisodeActionDropdownComp;
