import { Suspense } from "react";
import type { Metadata } from "next";
import UserPanelComp from "@/features/userPanel/userPanel.index";
import UserPanelSkeletonComp from "@/features/userPanel/userPanelSkeleton/userPanelSkeleton.index";
import { UserMovieTypeEnum } from "@/types";
import { GetTranslation } from "@/scripts/server/translation";
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await GetTranslation();
  return { title: t("UserPanel.metaWatchingTitle"), description: t("UserPanel.metaWatchingDescription") };
}

async function WatchingContent() {
  const { t } = await GetTranslation();
  return <UserPanelComp type={UserMovieTypeEnum.WATCHING} title={t("UserPanel.watching")} />;
}

export default function WatchingPage() {
  return <Suspense fallback={<UserPanelSkeletonComp watched />}><WatchingContent /></Suspense>;
}
