import { use, useCallback, useEffect, useRef, useState } from "react";
import { AppApis } from "../data";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AuthModalContext } from "../contexts/authModal";

function __UseGoogle() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const router = useRouter();
  const { setAuthMode } = use(AuthModalContext);

  const popupRef = useRef<Window | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }

    popupRef.current = null;
    setIsGoogleLoading(false);
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const expectedOrigin = new URL(
        AppApis.auth.googleFrontend
      ).origin;

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
        toast.error("auth.admin_only");
        return;
      }

      if (success) {
        cleanup();
        setAuthMode(null);

        // اجازه بده state های قبلی settle شوند
        router.refresh();
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [cleanup, router, setAuthMode]);

  const handleGoogleLogin = useCallback(() => {
    if (isGoogleLoading) {
      return;
    }

    setIsGoogleLoading(true);

    const popup = window.open(
      AppApis.auth.googleFrontend,
      "google-oauth",
      "width=500,height=600"
    );

    if (!popup) {
      setIsGoogleLoading(false);
      toast.error("auth.popup_blocked");
      return;
    }

    popupRef.current = popup;

    timeoutRef.current = setTimeout(() => {
      cleanup();
      toast.error("auth.timeout");
    }, 120_000);
  }, [cleanup, isGoogleLoading]);

  return {
    handleGoogleLogin,
    isGoogleLoading,
  };
}

export default __UseGoogle;