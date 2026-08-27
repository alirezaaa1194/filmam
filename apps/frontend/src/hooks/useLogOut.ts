import { use, useTransition } from "react";
import { ConfirmModalContext } from "../contexts/confirm";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { ClientCall } from "../scripts/client";
import { AppApis } from "../data";
import { toast } from "sonner";

function __UseLogOut() {
  const { setConfirm } = use(ConfirmModalContext);
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();

  const { mutateAsync } = useMutation({
    mutationFn: () => ClientCall(AppApis.auth.logout, { method: "POST" }),
    onSuccess: () => {
      toast.success("با موفقیت خارج شدید");
      startTransition(() => {
        router.refresh();
      });
    },
  });

  return { setConfirm, mutate: mutateAsync, isRefreshing };
}

export default __UseLogOut;
