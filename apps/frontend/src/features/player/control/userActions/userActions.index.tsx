import { Dislike, Like1 } from "iconsax-react";
import { Button } from "../../../../utilities/components/ui";
import { useQuery } from "@tanstack/react-query";
import { CommentEntityTypeEnum, UserMovieActionType, UserMovieTypeEnum } from "../../../../types";
import { AppApis } from "../../../../data";
import { ClientCall } from "../../../../scripts/client";
import { use } from "react";
import { LocaleContext, UserContext } from "../../../../contexts";
import { useMovieAction } from "../../../../utilities/components/movie/movieFunctionalities/movieFunctionalities.script";

function PlayerUserActionsComp({ entityType, entityId }: { entityType: CommentEntityTypeEnum; entityId: number }) {
  const user = use(UserContext);
  const { locale } = use(LocaleContext);
  const { data, isPending } = useQuery({
    queryKey: ["user-movie-actions", entityType, entityId],
    queryFn: () =>
      ClientCall<UserMovieActionType[]>(AppApis.userMovie.movieActions(entityId), {
        method: "GET",
        locale,
        query: {
          entity_type: entityType,
        },
      }),
    enabled: !!user,
  });

  const didUserLiked = data?.some((action) => action.type === UserMovieTypeEnum.LIKE);
  const didUserDisLiked = data?.find((action) => action.type === UserMovieTypeEnum.DISLIKE);

  const { toggleAction: likeAction } = useMovieAction({
    entityId,
    entityType,
    type: UserMovieTypeEnum.LIKE,
  });
  const { toggleAction: dislikeAction } = useMovieAction({
    entityId,
    entityType,
    type: UserMovieTypeEnum.DISLIKE,
  });

  if (isPending) {
    return "loading...";
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        className="size-11 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer border border-white/50 hover:border-white"
        onClick={() => {
          likeAction({
            entityId,
            isCurrentlySaved: !!didUserLiked,
          });
        }}
      >
        <Like1 variant={didUserLiked ? "Bold" : "Outline"} className="size-4.5 transition-all fill-white" />
      </Button>
      <Button
        className="size-11 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer border border-white/50 hover:border-white"
        onClick={() => {
          dislikeAction({
            entityId,
            isCurrentlySaved: !!didUserDisLiked,
          });
        }}
      >
        <Dislike variant={didUserDisLiked ? "Bold" : "Outline"} className="size-4.5 transition-all fill-white" />
      </Button>
    </div>
  );
}

export default PlayerUserActionsComp;
