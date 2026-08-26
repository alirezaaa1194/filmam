import { use, useState } from "react";
import { AppApis } from "../data";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AuthModalContext } from "../contexts/authModal";

function __UseGoogle() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { setAuthMode } = use(AuthModalContext);

  function handleGoogleLogin() {
    const popup = window.open(AppApis.auth.googleFrontend, "google-oauth", "width=500,height=600");
    if (!popup) {
      setIsGoogleLoading(false);
      toast.error("auth.popup_blocked");
      return;
    }
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== new URL(AppApis.auth.googleFrontend).origin) return;
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
      setAuthMode(null)
      router.refresh();
    };
    window.addEventListener("message", handleMessage);
  }
  return { handleGoogleLogin, isGoogleLoading };
}

export default __UseGoogle;
