import { use, useTransition } from "react";
import { ConfirmModalContext } from "../contexts/confirm";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { ClientCall } from "../scripts/client";
import { AppApis } from "../data";
import { toast } from "sonner";
import { useLocale } from ".";
import { TranslateServerError } from "../scripts";

function __UseLogOut() {
  const { setConfirm } = use(ConfirmModalContext);
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();
  const { t } = useLocale();

  const { mutateAsync } = useMutation({
    mutationFn: () => ClientCall(AppApis.auth.logout, { method: "POST" }),
    onSuccess: () => {
      toast.success(t("Auth.toasts.logoutSuccess"));
      startTransition(() => {
        router.refresh();
      });
    },
    onError: (error: Response) => {
      toast.error(t(TranslateServerError(error.status)));
    },
  });

  return { setConfirm, mutate: mutateAsync, isRefreshing };
}

export default __UseLogOut;
