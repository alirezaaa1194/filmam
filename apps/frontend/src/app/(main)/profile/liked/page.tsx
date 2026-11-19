import { Suspense } from "react";
import UserPanelComp from "@/features/userPanel/userPanel.index";
import UserPanelSkeletonComp from "@/features/userPanel/userPanelSkeleton/userPanelSkeleton.index";
import { UserMovieTypeEnum } from "@/types";
import { GetTranslation } from "@/scripts/server/translation";

async function LikedContent() {
  const { t } = await GetTranslation();
  return <UserPanelComp type={UserMovieTypeEnum.LIKE} title={t("UserPanel.liked")} />;
}

export default function LikedPage() {
  return <Suspense fallback={<UserPanelSkeletonComp />}><LikedContent /></Suspense>;
}
