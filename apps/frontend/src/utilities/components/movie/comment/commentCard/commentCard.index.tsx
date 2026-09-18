import Image from "next/image";
import userPlaceholder from "@/assets/images/userPlaceholder.webp";
import { Dislike, Like1 } from "iconsax-react";
import { AuthModeEnum, CommentEntityTypeEnum, CommentType, UserMovieTypeEnum } from "../../../../../types";
import { useCommentVote } from "./commentCard.script";
import { use } from "react";
import { UserContext } from "../../../../../contexts";
import { AuthModalContext } from "../../../../../contexts/authModal";
import { useLocale } from "../../../../../hooks";
import { FormatDate } from "../../../../../scripts";

function CommentCardComp({ entitySlug, entityType, comment }: { entitySlug: string; entityType: CommentEntityTypeEnum; comment: CommentType }) {
  const user = use(UserContext);
  const { setAuthMode } = use(AuthModalContext);
  const { vote: voteLike } = useCommentVote(entitySlug, entityType, UserMovieTypeEnum.LIKE, "نظر شما با موفقیت ثبت شد", "نظر شما با موفقیت ثبت شد", "خطا در ثبت نظر");
  const { vote: voteDislike } = useCommentVote(entitySlug, entityType, UserMovieTypeEnum.DISLIKE, "نظر شما با موفقیت ثبت شد", "نظر شما با موفقیت ثبت شد", "خطا در ثبت نظر");
  const { locale } = useLocale();

  return (
    <div className="flex flex-col p-4 bg-gray-13 border border-gray-12 rounded-md lg:rounded-xl gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src={userPlaceholder} alt="" width={16} height={16} className="size-10 rounded-full shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="text-primary text-h-6">{comment.user.username}</span>
            <span className="text-mobile-caption-md text-gray-9">{FormatDate(comment.created_at, locale)}</span>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-2">
            <span className="text-gray-9">{comment.likes_count}</span>
            <button
              onClick={() => {
                if (user) {
                  voteLike({
                    commentId: comment.id,
                    isCurrentlyVoted: comment.did_user_liked,
                  });
                } else {
                  setAuthMode({
                    mode: AuthModeEnum.LOGIN,
                    callback: () => {
                      voteLike({
                        commentId: comment.id,
                        isCurrentlyVoted: comment.did_user_liked,
                      });
                    },
                  });
                }
              }}
              className={`cursor-pointer ${comment.did_user_liked ? "hover:[&>svg]:fill-primary/80" : "hover:[&>svg]:fill-primary"}`}
            >
              <Like1 variant={comment.did_user_liked ? "Bold" : "Outline"} className={`${comment.did_user_liked ? "fill-primary" : "fill-gray-9"} size-4 lg:size-6 transition-all`} />
            </button>
          </span>
          <span className="flex items-center gap-2">
            <span className="text-gray-9">{comment.dislikes_count}</span>
            <button
              onClick={() => {
                if (user) {
                  voteDislike({
                    commentId: comment.id,
                    isCurrentlyVoted: comment.did_user_disliked,
                  });
                } else {
                  setAuthMode({
                    mode: AuthModeEnum.LOGIN,
                    callback: () => {
                      voteDislike({
                        commentId: comment.id,
                        isCurrentlyVoted: comment.did_user_disliked,
                      });
                    },
                  });
                }
              }}

              className={`cursor-pointer ${comment.did_user_disliked ? "hover:[&>svg]:fill-complementary/80" : "hover:[&>svg]:fill-complementary"}`}
            >
              <Dislike variant={comment.did_user_disliked ? "Bold" : "Outline"} className={`${comment.did_user_disliked ? "fill-complementary" : "fill-gray-9"} size-4 lg:size-6 transition-all`} />
            </button>
          </span>
        </div>
      </div>
      <p className="ps-0 lg:ps-[52px] text-gray-6 text-caption-lg">{comment.body}</p>
    </div>
  );
}

export default CommentCardComp;
