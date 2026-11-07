import Image from "next/image";
import { use } from "react";
import { Dislike, Like1 } from "iconsax-react";
import userPlaceholder from "@/assets/images/userPlaceholder.webp";
import { AppLanguagesEnum, AuthModeEnum, UserMovieTypeEnum } from "../../../../../types";
import { useCommentVote } from "./commentCard.script";
import { UserContext } from "../../../../../contexts";
import { AuthModalContext } from "../../../../../contexts/authModal";
import { useLocale } from "../../../../../hooks";
import { FormatDate, HashEmail } from "../../../../../scripts";
import { CommentCardCompProps } from "./commentCard.type";

function CommentCardComp({ entitySlug, entityType, comment }: CommentCardCompProps) {
  const user = use(UserContext);
  const { setAuthMode } = use(AuthModalContext);
  const { locale, t } = useLocale();
  const commentText = comment.body ?? "";
  const hasArabicScript = /[\u0600-\u06ff\u0750-\u077f]/u.test(commentText);
  const hasPersianLetters = /[پچژگکی]/u.test(commentText);
  const hasLatinLetters = /[a-z]/iu.test(commentText);
  const commentLanguage = hasPersianLetters
    ? AppLanguagesEnum.FA
    : hasArabicScript
      ? AppLanguagesEnum.AR
      : hasLatinLetters
        ? AppLanguagesEnum.EN
        : locale;
  const commentDir = commentLanguage === AppLanguagesEnum.EN ? "ltr" : "rtl";
  const commentFont = commentLanguage === AppLanguagesEnum.FA ? "font-fa" : commentLanguage === AppLanguagesEnum.AR ? "font-ar" : "font-en";

  const { vote: voteLike } = useCommentVote(entitySlug, entityType, UserMovieTypeEnum.LIKE, t("MovieDetail.commentSuccess"), t("MovieDetail.commentSuccess"), t("MovieDetail.actionError"));
  const { vote: voteDislike } = useCommentVote(entitySlug, entityType, UserMovieTypeEnum.DISLIKE, t("MovieDetail.commentSuccess"), t("MovieDetail.commentSuccess"), t("MovieDetail.actionError"));

  const handleVote = (voteFn: typeof voteLike, commentId: number, isCurrentlyVoted: boolean) => {
    if (user) {
      voteFn({ commentId, isCurrentlyVoted });
    } else {
      setAuthMode({
        mode: AuthModeEnum.LOGIN,
        callback: () => voteFn({ commentId, isCurrentlyVoted }),
      });
    }
  };
  const hashedEmail = HashEmail(comment.user.email);

  return (
    <div className="flex flex-col p-4 bg-gray-13 border border-gray-12 rounded-md lg:rounded-xl gap-3 lg:gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 lg:gap-3 min-w-0">
          <Image src={`https://www.gravatar.com/avatar/${hashedEmail}?d=mp`} alt={comment.user.username} width={40} height={40} className="size-9 lg:size-10 rounded-full shrink-0 bg-gray-11" />
          <div className="flex flex-col min-w-0">
            <span className="text-white text-caption-md truncate">{comment.user.username}</span>
            <span className="text-gray-8 text-mobile-caption-sm lg:text-caption-md">{FormatDate(comment.created_at, locale)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 lg:gap-5 shrink-0">
          <div className="flex items-center gap-1.5 lg:gap-2">
            <span className="text-gray-7 text-mobile-caption-md lg:text-caption-md tabular-nums">{comment.likes_count}</span>
            <button type="button" onClick={() => handleVote(voteLike, comment.id, comment.did_user_liked)} className="cursor-pointer flex items-center justify-center transition-colors" aria-label={t("MovieDetail.like")}>
              <Like1 variant={comment.did_user_liked ? "Bold" : "Outline"} className={`size-5 lg:size-5 transition-all ${comment.did_user_liked ? "fill-primary" : "fill-gray-8 hover:fill-primary"}`} />
            </button>
          </div>
          <div className="flex items-center gap-1.5 lg:gap-2">
            <span className="text-gray-7 text-mobile-caption-md lg:text-caption-md tabular-nums">{comment.dislikes_count}</span>
            <button type="button" onClick={() => handleVote(voteDislike, comment.id, comment.did_user_disliked)} className="cursor-pointer flex items-center justify-center transition-colors" aria-label={t("MovieDetail.dislike")}>
              <Dislike variant={comment.did_user_disliked ? "Bold" : "Outline"} className={`size-5 lg:size-5 transition-all ${comment.did_user_disliked ? "fill-complementary" : "fill-gray-8 hover:fill-complementary"}`} />
            </button>
          </div>
        </div>
      </div>
      <p dir={commentDir} className={`text-gray-3 text-body-xxs ps-0 lg:ps-[52px] whitespace-pre-wrap break-words text-start ${commentFont}`}>{commentText}</p>
    </div>
  );
}

export default CommentCardComp;
