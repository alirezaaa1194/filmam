import { use } from "react";
import { UserContext } from "../../../../contexts";
import { AuthModalContext } from "../../../../contexts/authModal";
import { useDeviceSubscriptionStatus, useMovieNotification } from "../../../../utilities/components/movie/movieFunctionalities/notification/notification.script";
import { AuthModeEnum, MovieDetailPublicType } from "../../../../types";

export function useMovieNotificationAction(movie: MovieDetailPublicType, didUserSaved?: boolean) {
  const user = use(UserContext);
  const { setAuthMode } = use(AuthModalContext);
  const { hasDeviceSubscription } = useDeviceSubscriptionStatus();
  const { toggleMovieNotification } = useMovieNotification();

  const isFullyActive = didUserSaved && hasDeviceSubscription;

  const handleToggle = () => {
    const run = () =>
      toggleMovieNotification({
        movieId: movie.id,
        isCurrentlyEnabled: !!didUserSaved,
        hasDeviceSubscription,
      });

    if (user) {
      run();
    } else {
      setAuthMode({
        mode: AuthModeEnum.LOGIN,
        callback: run,
      });
    }
  };

  return { isFullyActive, handleToggle };
}
