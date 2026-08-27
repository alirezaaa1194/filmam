import { useState, useCallback, useRef, useEffect, use } from "react";
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
  const checkClosedRef = useRef<NodeJS.Timeout | null>(null);
  const isSuccessRef = useRef<boolean>(false); // ← اضافه شد

  const cleanup = useCallback((showError: boolean = false) => {
    // Remove message listener
    if (listenerRef.current) {
      window.removeEventListener("message", listenerRef.current);
      listenerRef.current = null;
    }

    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Clear check closed interval
    if (checkClosedRef.current) {
      clearInterval(checkClosedRef.current);
      checkClosedRef.current = null;
    }

    // Close popup if open
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }
    popupRef.current = null;

    // Reset loading state
    setIsGoogleLoading(false);

    // Show error only if not success and not already cleaned
    if (showError && !isSuccessRef.current) {
      toast.error("Login window was closed.");
    }
  }, []);

  const handleGoogleLogin = useCallback(() => {
    // Prevent multiple clicks
    if (isGoogleLoading) return;
    setIsGoogleLoading(true);
    isSuccessRef.current = false; // ← reset success flag

    // Open popup
    const popup = window.open(AppApis.auth.googleFrontend, "google-oauth", "width=500,height=600,menubar=no,toolbar=no,location=no,status=no");

    if (!popup) {
      setIsGoogleLoading(false);
      toast.error("Popup was blocked. Please allow popups for this site.");
      return;
    }

    popupRef.current = popup;

    // Message handler
    const handleMessage = (event: MessageEvent) => {
      const expectedOrigin = new URL(AppApis.auth.googleFrontend).origin;
      if (event.origin !== expectedOrigin) return;

      const { success, error } = event.data;

      if (error) {
        isSuccessRef.current = false;
        cleanup(false);
        setAuthMode(null);
        toast.error(error === "admin_only" ? "auth.admin_only" : "Authentication failed");
        return;
      }

      if (success) {
        isSuccessRef.current = true; // ← set success flag
        cleanup(false);
        setAuthMode(null);
        router.refresh();
        toast.success("Successfully logged in!");
        return;
      }
    };

    listenerRef.current = handleMessage;
    window.addEventListener("message", handleMessage);

    // Timeout after 2 minutes
    timeoutRef.current = setTimeout(() => {
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
      cleanup(true);
      toast.error("Login timed out. Please try again.");
    }, 120000);

    // Check if popup closed by user
    checkClosedRef.current = setInterval(() => {
      if (popupRef.current?.closed) {
        cleanup(true); // ← show error if closed
      }
    }, 500);

    // Cleanup if popup unloads
    popup.addEventListener("beforeunload", () => {
      if (checkClosedRef.current) {
        clearInterval(checkClosedRef.current);
        checkClosedRef.current = null;
      }
    });
  }, [isGoogleLoading, router, setAuthMode, cleanup]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanup(false);
    };
  }, [cleanup]);

  return { handleGoogleLogin, isGoogleLoading };
}

export default __UseGoogle;
