"use client";

import { Dislike, Like1 } from "iconsax-react";
import { Button } from "@/utilities/components/ui";
import { PlayerUserActionsProps } from "./userActions.type";
import { useUserActions } from "./userActions.script";

export default function PlayerUserActionsComp(props: PlayerUserActionsProps) {
  const { entityId } = props;
  const { user, isPending, didUserLiked, didUserDisLiked, likeAction, dislikeAction } = useUserActions(props);

  if (isPending || !user) return null;

  return (
    <div className="flex items-center gap-4">
      <Button className="size-11 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer border border-white/50 hover:border-white" onClick={() => likeAction({ entityId, isCurrentlySaved: didUserLiked })}>
        <Like1 variant={didUserLiked ? "Bold" : "Outline"} className="size-5 transition-all fill-white" />
      </Button>
      <Button className="size-11 rounded-full bg-gray-14/50 hover:bg-gray-14 backdrop-blur-[20px] cursor-pointer border border-white/50 hover:border-white" onClick={() => dislikeAction({ entityId, isCurrentlySaved: didUserDisLiked })}>
        <Dislike variant={didUserDisLiked ? "Bold" : "Outline"} className="size-5 transition-all fill-white" />
      </Button>
    </div>
  );
}
