import { ArrowDown2 } from "iconsax-react";
import { Button } from "../../ui";
import CommentCardComp from "./commentCard/commentCard.index";
import CommentInputComp from "./commentInput/commentInput.index";

function CommentSectionComp() {
  return (
    <section className="px-layout-x-space max-w-layout-max mx-auto mt-10 lg:mt-14 flex flex-col gap-6 lg:gap-12">
      <h5 className="text-mobile-h-5 lg:text-h-5">دیدگاه ها</h5>
      <div className="flex flex-col gap-3">
        <CommentInputComp />
        <div className="flex flex-col gap-2">
          <CommentCardComp />
          <CommentCardComp />
          <CommentCardComp />
          <CommentCardComp />
        </div>
        <Button className="h-10 px-8 w-fit mx-auto rounded-md cursor-pointer border-gray-10 text-gray-10 hover:text-primary hover:border-primary hover:[&>svg]:stroke-primary" variant="outline">
          مشاهده بیشتر <ArrowDown2 className="stroke-gray-10 size-5 transition-all" />
        </Button>
      </div>
    </section>
  );
}

export default CommentSectionComp;
