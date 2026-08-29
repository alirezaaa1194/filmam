import { use, useCallback, useEffect, useRef, useState } from "react";
import { AppApis } from "../data";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AuthModalContext } from "../contexts/authModal";
import { useLocale } from ".";

function __UseGoogle() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const router = useRouter();
  const { setAuthMode } = use(AuthModalContext);
  const { t } = useLocale();

  const popupRef = useRef<Window | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }

    popupRef.current = null;
    setIsGoogleLoading(false);
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const expectedOrigin = new URL(AppApis.auth.googleFrontend).origin;

      if (event.origin !== expectedOrigin) {
        return;
      }

      if (event.source !== popupRef.current) {
        return;
      }

      const { success, error } = event.data ?? {};

      if (error) {
        cleanup();
        setAuthMode(null);
        toast.error(t("errors.adminOnly"));
        return;
      }

      if (success) {
        cleanup();
        setAuthMode(null);

        router.refresh();
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cleanup, router, setAuthMode, t]);

  const handleGoogleLogin = useCallback(() => {
    if (isGoogleLoading) {
      return;
    }

    setIsGoogleLoading(true);

    const popup = window.open(AppApis.auth.googleFrontend, "google-oauth", "width=500,height=600");

    if (!popup) {
      setIsGoogleLoading(false);
      toast.error(t("errors.popupBlocked"));
      return;
    }

    popupRef.current = popup;

    intervalRef.current = setInterval(() => {
      if (popupRef.current?.closed) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        cleanup();
        setAuthMode(null);
      }
    }, 500);

    timeoutRef.current = setTimeout(() => {
      cleanup();
      toast.error(t("errors.timeout"));
    }, 120_000);
  }, [cleanup, isGoogleLoading, setAuthMode, t]);

  return {
    handleGoogleLogin,
    isGoogleLoading,
  };
}

export default __UseGoogle;
