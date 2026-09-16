"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ClientCall } from "@/scripts/client";
import { AppApis } from "@/data";
import { toast } from "sonner";
import { SectionUserMovieTypeEnum, UserMovieActionType, UserMovieTypeEnum } from "@/types";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function getDevicePermission(): NotificationPermission | null {
  if (typeof window === "undefined" || !("Notification" in window)) return null;
  return Notification.permission;
}

async function getExistingSubscription(): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return null;
  const registration = await navigator.serviceWorker.getRegistration("/");
  if (!registration) return null;
  return registration.pushManager.getSubscription();
}

async function createDeviceSubscription() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    throw new Error("NOT_SUPPORTED");
  }

  if (Notification.permission === "default") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") throw new Error("PERMISSION_DENIED");
  } else if (Notification.permission === "denied") {
    throw new Error("PERMISSION_BLOCKED");
  }

  const registration = await navigator.serviceWorker.register("/sw.js", {
    scope: "/",
  });
  await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
  });

  const json = subscription.toJSON();
  return {
    endpoint: json.endpoint!,
    p256dh: json.keys?.p256dh!,
    auth: json.keys?.auth!,
  };
}

export function useDeviceSubscriptionStatus() {
  const { data, isLoading } = useQuery({
    queryKey: ["device-push-status"],
    queryFn: async () => {
      const permission = getDevicePermission();
      if (permission !== "granted") {
        return { hasSubscription: false, permission };
      }
      const subscription = await getExistingSubscription();
      return { hasSubscription: !!subscription, permission };
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  return {
    hasDeviceSubscription: data?.hasSubscription ?? false,
    permission: data?.permission ?? "default",
    isCheckingDevice: isLoading,
  };
}

type ToggleParams = {
  movieId: number;
  isCurrentlyEnabled: boolean;
  hasDeviceSubscription: boolean;
};

export function useMovieNotification() {
  const queryClient = useQueryClient();

  const [isSubscribingDevice, setIsSubscribingDevice] = useState(false);

  const toggleMutation = useMutation({
    mutationFn: async ({ movieId, isCurrentlyEnabled, hasDeviceSubscription }: ToggleParams) => {
      if (!hasDeviceSubscription) {
        setIsSubscribingDevice(true);
        try {
          const newSub = await createDeviceSubscription();

          await ClientCall(AppApis.notification.index, {
            method: "POST",
            body: newSub,
          });
        } finally {
          setIsSubscribingDevice(false);
        }

        if (isCurrentlyEnabled) {
          return { deviceOnly: true };
        }
      }

      return ClientCall(AppApis.userMovie.index, {
        method: "POST",
        body: {
          movie_id: movieId,
          type: UserMovieTypeEnum.NOTIFICATION,
          entity_type: SectionUserMovieTypeEnum.MOVIE,
        },
      });
    },

    onMutate: async ({ movieId, isCurrentlyEnabled, hasDeviceSubscription }) => {
      await queryClient.cancelQueries({
        queryKey: ["user-movie-actions", movieId],
      });

      const previousActions = queryClient.getQueryData(["user-movie-actions", movieId]);
      const previousDevice = queryClient.getQueryData(["device-push-status"]);

      if (!hasDeviceSubscription) {
        queryClient.setQueryData(["device-push-status"], {
          hasSubscription: true,
          permission: "granted",
        });
      }

      const willToggleMovie = !(isCurrentlyEnabled && !hasDeviceSubscription);

      if (willToggleMovie) {
        if (isCurrentlyEnabled) {
          toast.success("اعلان این فیلم غیرفعال شد");
        } else {
          toast.success("اعلان این فیلم فعال شد");
        }
        
        queryClient.setQueryData(["user-movie-actions", movieId], (old: UserMovieActionType[] | undefined) => {
          if (!old) return old;
          if (isCurrentlyEnabled) {
            return old.filter((a) => a.type !== UserMovieTypeEnum.NOTIFICATION);
          }
          return [
            ...old,
            {
              type: UserMovieTypeEnum.NOTIFICATION,
              movie_id: movieId,
            },
          ];
        });
      }

      return { previousActions, previousDevice, willToggleMovie };
    },

    onError: (error: any, { movieId }, context) => {
      if (context?.previousActions) {
        queryClient.setQueryData(["user-movie-actions", movieId], context.previousActions);
      }
      if (context?.previousDevice) {
        queryClient.setQueryData(["device-push-status"], context.previousDevice);
      }

      if (error?.message === "PERMISSION_DENIED") {
        toast.error("برای فعال‌سازی اعلان‌ها باید اجازه بدهید");
      } else if (error?.message === "PERMISSION_BLOCKED") {
        toast.error("شما قبلاً اعلان‌ها را رد کرده‌اید. از تنظیمات مرورگر فعالش کنید.");
      } else if (error?.message === "NOT_SUPPORTED") {
        toast.error("مرورگر شما از اعلان‌ها پشتیبانی نمی‌کند");
      } else {
        toast.error("خطا در تغییر وضعیت اعلان");
      }
    },

    onSuccess: (data: any) => {
      if (data?.deviceOnly) {
        toast.success("اعلان‌ها روی این دستگاه فعال شد");
      }
    },

    onSettled: (_data, _err, { movieId }) => {
      queryClient.invalidateQueries({
        queryKey: ["user-movie-actions", movieId],
      });
      queryClient.invalidateQueries({ queryKey: ["device-push-status"] });
    },
  });

  return {
    toggleMovieNotification: (params: ToggleParams) => toggleMutation.mutate(params),
    isLoading: isSubscribingDevice,
  };
}
