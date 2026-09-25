import { Message2 } from "iconsax-react";
import { CommentEmptyStateCompProps } from "./emptyState.type";

function CommentEmptyStateComp({ title = "کامنتی وجود ندارد", description = "اولین نفری باشید که نظر می‌دهید", action }: CommentEmptyStateCompProps) {
  return (
    <div className="bg-gray-13 border border-gray-12 rounded-md lg:rounded-xl flex flex-col items-center justify-center gap-4 lg:gap-5 py-10 lg:py-14 px-6 text-center">
      <span className="size-11 lg:size-14 rounded-full bg-gray-12 border border-gray-11 flex items-center justify-center shrink-0">
        <Message2 variant="Outline" className="size-5 lg:size-7 fill-primary" />
      </span>
      <div className="flex flex-col gap-1.5 items-center">
        <h5 className="text-h-6 lg:text-h-5">{title}</h5>
        <span className="text-caption-md lg:text-caption-lg text-gray-7">{description}</span>
      </div>
      {action}
    </div>
  );
}

export default CommentEmptyStateComp;
