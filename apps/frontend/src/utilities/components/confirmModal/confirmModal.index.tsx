import { use, useState } from "react";
import { ConfirmModalContext } from "@/contexts/confirm";
import { InfoCircle } from "iconsax-react";
import { Button, Confirm, ConfirmContent, Separator, Spinner } from "../ui";
import { useLocale } from "../../../hooks";

function ConfirmModal() {
  const { confirm, setConfirm } = use(ConfirmModalContext);
  const [isPending, setIsPending] = useState(false);
  const { t } = useLocale();

  const handleConfirm = async () => {
    try {
      setIsPending(true);
      if (confirm?.callback) {
        await confirm.callback();
        setConfirm(null);
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Confirm
      open={confirm !== null}
      onOpenChange={(open) => {
        if (!open) {
          setConfirm(null);
        }
      }}
    >
      <ConfirmContent>
        <div className="flex flex-col items-center lg:px-6 lg:pb-12">
          <InfoCircle className="absolute t-5 inset-s-5 stroke-gray-10 size-6 lg:hidden" />
          <h5 className="text-mobile-h-5 lg:text-h-5 text-white lg:mt-6">{confirm?.title}</h5>
          <Separator className="bg-gray-10 mt-2 lg:hidden" />
          <p className="text-gray-7 lg:text-[#fff] text-body-xxs lg:text-button-md mt-2 lg:mt-8">{confirm?.description}</p>
          <div className="mt-4 lg:mt-12 flex gap-3 w-full">
            <Button className="flex-1 h-12 rounded-md cursor-pointer bg-primary border border-success text-body-xxs" onClick={handleConfirm} disabled={isPending}>
              {isPending || confirm?.isRefreshing ? <Spinner /> : null} {confirm?.submitText ?? t("confirm.logout.submitTitle")}
            </Button>
            <Button
              onClick={() => {
                setConfirm(null);
              }}
              className="flex-1 h-12 rounded-md cursor-pointer bg-gray-14 border border-gray-9 text-gray-9! hover:bg-gray-13 text-body-xxs"
              disabled={isPending}
            >
              {confirm?.cancelText ?? t("confirm.logout.cancelTitle")}
            </Button>
          </div>
        </div>
      </ConfirmContent>
    </Confirm>
  );
}

export default ConfirmModal;
