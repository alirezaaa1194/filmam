import { Notification } from "iconsax-react";
import { Button } from "../../../ui";
import { AuthModeEnum, UserMovieActionType, UserMovieTypeEnum } from "../../../../../types";
import { useDeviceSubscriptionStatus, useMovieNotification } from "./notification.script";
import { use } from "react";
import { UserContext } from "../../../../../contexts";
import { AuthModalContext } from "../../../../../contexts/authModal";

function MovieNotificationFunctionalityComp({ actions, movieId }: { actions: UserMovieActionType[]; movieId: number }) {
  const didUserSaved = actions.some((action) => action.type === UserMovieTypeEnum.NOTIFICATION);
  const { hasDeviceSubscription, isCheckingDevice } = useDeviceSubscriptionStatus();
  const { toggleMovieNotification, isLoading } = useMovieNotification();

  const isFullyActive = didUserSaved && hasDeviceSubscription;
  const isPartiallyActive = didUserSaved && !hasDeviceSubscription;

  const user = use(UserContext);
  const { setAuthMode } = use(AuthModalContext);

  return (
    <Button
      onClick={() => {
        if (user) {
          toggleMovieNotification({
            movieId,
            isCurrentlyEnabled: didUserSaved,
            hasDeviceSubscription,
          });
        } else {
          setAuthMode({
            mode: AuthModeEnum.LOGIN,
            callback: async () => {
              toggleMovieNotification({
                movieId,
                isCurrentlyEnabled: didUserSaved,
                hasDeviceSubscription,
              });
            },
          });
        }
      }}

      disabled={isLoading || isCheckingDevice}
      className={`size-9 lg:size-14 rounded-md lg:rounded-lg cursor-pointer border ${isFullyActive ? "bg-warning border-warning hover:bg-warning hover:bg-warning/80 hover:border-warning/80" : isPartiallyActive ? " bg-warning hover:bg-warning opacity-40 hover:opacity-60" : "bg-white/7 backdrop-blur-[12px] border-white/10 hover:border-warning hover:bg-white/7 hover:[&>svg]:fill-warning"}`}
    >
      <Notification variant={didUserSaved ? "Bold" : "Outline"} className="size-4 lg:size-7 transition-all fill-white" />
    </Button>
  );
}

export default MovieNotificationFunctionalityComp;
