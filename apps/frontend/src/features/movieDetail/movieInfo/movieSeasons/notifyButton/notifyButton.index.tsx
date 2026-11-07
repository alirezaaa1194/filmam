import { Button } from "@/utilities/components/ui";
import { NotifyButtonProps } from "./notifyButton.type";
import { useLocale } from "../../../../../hooks";

function NotifyButtonComp({ onClick, className }: NotifyButtonProps) {
  const { t } = useLocale();
  return (
    <Button className={`h-8 lg:h-10 px-6 cursor-pointer rounded-md text-caption-lg ${className ?? ""}`} onClick={onClick}>
      {t("MovieDetail.enableNotifications")}
    </Button>
  );
}

export default NotifyButtonComp;
