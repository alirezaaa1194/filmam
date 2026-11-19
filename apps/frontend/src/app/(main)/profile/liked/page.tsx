import { Suspense } from "react";
import type { Metadata } from "next";
import UserPanelComp from "@/features/userPanel/userPanel.index";
import UserPanelSkeletonComp from "@/features/userPanel/userPanelSkeleton/userPanelSkeleton.index";
import { UserMovieTypeEnum } from "@/types";
import { GetTranslation } from "@/scripts/server/translation";
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await GetTranslation();
  return { title: t("UserPanel.metaLikedTitle"), description: t("UserPanel.metaLikedDescription") };
}

async function LikedContent() {
  const { t } = await GetTranslation();
  return <UserPanelComp type={UserMovieTypeEnum.LIKE} title={t("UserPanel.liked")} />;
}

export default function LikedPage() {
  return <Suspense fallback={<UserPanelSkeletonComp />}><LikedContent /></Suspense>;
}
