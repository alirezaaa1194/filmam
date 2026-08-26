import { useState } from "react";
import { AppApis } from "../data";
import { toast } from "sonner";

function __UseGoogle() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  function handleGoogleLogin() {
    // window.location.href = AppApis.auth.googleFrontend;
    const popup = window.open(AppApis.auth.googleAdmin, "google-oauth", "width=500,height=600");
    if (!popup) {
      setIsGoogleLoading(false);
      toast.error("auth.popup_blocked");
      return;
    }
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== new URL(AppApis.auth.googleAdmin).origin) return;
      const { success, error } = event.data;
      if (error) {
        setIsGoogleLoading(false);
        toast.error("auth.admin_only");
        window.removeEventListener("message", handleMessage);
        return;
      }
      if (!success) {
        setIsGoogleLoading(false);
        return;
      }
      setIsGoogleLoading(false);
      window.removeEventListener("message", handleMessage);
    };
    window.addEventListener("message", handleMessage);
  }
  return { handleGoogleLogin, isGoogleLoading };
}

export default __UseGoogle;
