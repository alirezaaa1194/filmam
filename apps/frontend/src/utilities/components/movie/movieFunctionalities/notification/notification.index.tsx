import { Notification } from "iconsax-react";
import { Button } from "../../../ui";
import { UserMovieActionType, UserMovieTypeEnum } from "../../../../../types";
import { useDeviceSubscriptionStatus, useMovieNotification } from "./notification.script";

function MovieNotificationFunctionalityComp({ actions, movieId }: { actions: UserMovieActionType[]; movieId: number }) {
  const didUserSaved = actions.some((action) => action.type === UserMovieTypeEnum.NOTIFICATION);
  const { hasDeviceSubscription, isCheckingDevice } = useDeviceSubscriptionStatus();
  const { toggleMovieNotification, isLoading } = useMovieNotification();

  const isFullyActive = didUserSaved && hasDeviceSubscription;
  const isPartiallyActive = didUserSaved && !hasDeviceSubscription;

  return (
    <Button
      onClick={() =>
        toggleMovieNotification({
          movieId,
          isCurrentlyEnabled: didUserSaved,
          hasDeviceSubscription,
        })
      }
      disabled={isLoading || isCheckingDevice}
      className={`size-9 lg:size-14 rounded-full cursor-pointer ${isFullyActive ? "bg-warning hover:bg-warning hover:opacity-80" : isPartiallyActive ? "opacity-40 hover:opacity-60" : "bg-white/7 backdrop-blur-[12px] border border-white/10 hover:border-warning hover:bg-white/7 hover:[&>svg]:fill-warning"}`}
    >
      <Notification variant={didUserSaved ? "Bold" : "Outline"} className="size-4 lg:size-6 transition-all fill-white" />
    </Button>
  );
}

export default MovieNotificationFunctionalityComp;
