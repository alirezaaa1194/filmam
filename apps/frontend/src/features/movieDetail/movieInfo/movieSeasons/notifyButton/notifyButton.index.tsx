import { Button } from "@/utilities/components/ui";
import { NotifyButtonProps } from "./notifyButton.type";

function NotifyButtonComp({ onClick, className }: NotifyButtonProps) {
  return (
    <Button className={`h-8 lg:h-10 px-6 cursor-pointer rounded-md text-caption-lg ${className ?? ""}`} onClick={onClick}>
      فعال‌سازی اعلان‌ها
    </Button>
  );
}

export default NotifyButtonComp;
