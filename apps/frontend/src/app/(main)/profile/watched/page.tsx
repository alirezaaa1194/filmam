import { Suspense } from "react";
import type { Metadata } from "next";
import UserPanelComp from "@/features/userPanel/userPanel.index";
import UserPanelSkeletonComp from "@/features/userPanel/userPanelSkeleton/userPanelSkeleton.index";
import { UserMovieTypeEnum } from "@/types";
import { GetTranslation } from "@/scripts/server/translation";
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await GetTranslation();
  return { title: t("UserPanel.metaWatchedTitle"), description: t("UserPanel.metaWatchedDescription") };
}

async function WatchedContent() {
  const { t } = await GetTranslation();
  return <UserPanelComp type={UserMovieTypeEnum.WATCHED} title={t("UserPanel.watched")} />;
}

export default function WatchedPage() {
  return <Suspense fallback={<UserPanelSkeletonComp watched />}><WatchedContent /></Suspense>;
}
