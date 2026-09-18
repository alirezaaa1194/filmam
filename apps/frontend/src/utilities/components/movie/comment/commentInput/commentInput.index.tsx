import Image from "next/image";
import { Button, Spinner } from "../../../ui";
import userPlaceholder from "@/assets/images/userPlaceholder.webp";
import { Send } from "iconsax-react";
import { Textarea } from "../../../ui/textarea";
import { useLocale } from "../../../../../hooks";
import { useMutation } from "@tanstack/react-query";
import { ClientCall } from "../../../../../scripts/client";
import { AppApis } from "../../../../../data";
import { use, useState } from "react";
import { UserContext } from "../../../../../contexts";
import { toast } from "sonner";
import { AuthModalContext } from "../../../../../contexts/authModal";
import { AuthModeEnum, CommentEntityTypeEnum } from "../../../../../types";

function CommentInputComp({ entityId, entityType }: { entityId: number; entityType: CommentEntityTypeEnum }) {
  const { dir } = useLocale();
  const user = use(UserContext);
  const { setAuthMode } = use(AuthModalContext);
  const [inputValue, setInputValue] = useState("");
  const { mutate, isPending } = useMutation({
    mutationFn: ({ body }: { body: string }) =>
      ClientCall(AppApis.comment.create, {
        method: "POST",
        body: {
          ...(entityType === CommentEntityTypeEnum.MOVIE ? { movie_id: entityId } : { episode_id: entityId }),
          entity_type: entityType,
          body,
        },
      }),
    onSuccess: () => {
      setInputValue("");
      toast.success("کامنت با موفقیت ثبت شد");
    },
    onError: () => {
      toast.error("خطا در ثبت کامنت");
    },
  });

  const postCommentHandler = ({ body }: { body: string }) => {
    if (!body.trim().length) {
      toast.error("متن کامنت نباید خالی باشد");
      return;
    }

    if (user) {
      mutate({ body });
    } else {
      setAuthMode({
        mode: AuthModeEnum.LOGIN,
        callback: () => {
          mutate({ body });
        },
      });
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-13 border border-gray-12 rounded-md lg:rounded-xl gap-10 lg:gap-16">
      <div className="flex items-start gap-3 flex-1">
        <Image src={userPlaceholder} alt="" width={16} height={16} className="size-10 rounded-full shrink-0" />
        <div className="relative w-full">
          <Textarea placeholder="دیدگاه خودرا بنویسید" disabled={isPending} value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="pe-[52px] pt-3.5 bg-gray-12 rounded-md min-h-12 h-12 focus:h-20 lg:scrollbar-none resize-none" />
          <Button onClick={() => postCommentHandler({ body: inputValue })} className={`w-fit h-fit p-0 bg-transparent! cursor-pointer absolute inset-e-4 top-[13px] ${!isPending ? "[&>svg]:fill-white hover:[&>svg]:fill-primary" : ""}`}>
            {isPending ? <Spinner /> : <Send variant="Bold" className={`size-5 transition-all ${dir === "rtl" ? "rotate-180" : ""}`} />}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CommentInputComp;
