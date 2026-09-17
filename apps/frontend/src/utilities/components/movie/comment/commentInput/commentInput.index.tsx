import Image from "next/image";
import { Button } from "../../../ui";
import userPlaceholder from "@/assets/images/userPlaceholder.webp";
import { Send } from "iconsax-react";
import { Textarea } from "../../../ui/textarea";
import { useLocale } from "../../../../../hooks";

function CommentInputComp() {
  const { dir } = useLocale();
  return (
    <div className="flex items-center justify-between p-4 bg-gray-13 border border-gray-12 rounded-md lg:rounded-xl gap-10 lg:gap-16">
      <div className="flex items-start gap-3 flex-1">
        <Image src={userPlaceholder} alt="" width={16} height={16} className="size-10 rounded-full shrink-0" />
        <div className="relative w-full">
          <Textarea placeholder="دیدگاه خودرا بنویسید" className="bg-gray-12 rounded-md min-h-12 h-12 focus:h-20 lg:scrollbar-none resize-none" />
          <Button className="w-fit h-fit p-0 bg-transparent! cursor-pointer absolute inset-e-4 top-[13px] [&>svg]:fill-white hover:[&>svg]:fill-primary">
            <Send className={`size-5 transition-all ${dir === "rtl" ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CommentInputComp;
