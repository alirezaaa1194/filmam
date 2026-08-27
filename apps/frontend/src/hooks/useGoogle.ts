import { use, useState, useCallback, useRef } from "react";
import { AppApis } from "../data";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AuthModalContext } from "../contexts/authModal";

function __UseGoogle() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { setAuthMode } = use(AuthModalContext);
  const popupRef = useRef<Window | null>(null);
  const listenerRef = useRef<((event: MessageEvent) => void) | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(() => {
    if (listenerRef.current) {
      window.removeEventListener("message", listenerRef.current);
      listenerRef.current = null;
    }
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

  const handleGoogleLogin = useCallback(() => {
    if (isGoogleLoading) return;
    setIsGoogleLoading(true);

    const popup = window.open(AppApis.auth.googleFrontend, "google-oauth", "width=500,height=600");
    if (!popup) {
      setIsGoogleLoading(false);
      toast.error("auth.popup_blocked");
      return;
    }
    popupRef.current = popup;

    const handleMessage = (event: MessageEvent) => {
      const expectedOrigin = new URL(AppApis.auth.googleFrontend).origin;
      if (event.origin !== expectedOrigin) return;

      const { success, error } = event.data;
      if (error) {
        cleanup();
        setAuthMode(null);
        toast.error("auth.admin_only");
        return;
      }
      if (success) {
        cleanup();
        setAuthMode(null);
        router.refresh();
      }
    };

    listenerRef.current = handleMessage;
    window.addEventListener("message", handleMessage);

    timeoutRef.current = setTimeout(() => {
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
      cleanup();
      toast.error("auth.timeout");
    }, 120000);

    const checkClosed = setInterval(() => {
      if (popupRef.current?.closed) {
        clearInterval(checkClosed);
        cleanup();
      }
    }, 500);

    popupRef.current.addEventListener("beforeunload", () => {
      clearInterval(checkClosed);
    });
  }, [isGoogleLoading, router, setAuthMode, cleanup]);

  return { handleGoogleLogin, isGoogleLoading };
}

export default __UseGoogle;