import { Suspense } from "react";
import UserPanelComp from "@/features/userPanel/userPanel.index";
import UserPanelSkeletonComp from "@/features/userPanel/userPanelSkeleton/userPanelSkeleton.index";
import { UserMovieTypeEnum } from "@/types";
import { GetTranslation } from "@/scripts/server/translation";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Continue watching | Filmam", description: "Continue watching your movies and series on Filmam." };

async function WatchingContent() {
  const { t } = await GetTranslation();
  return <UserPanelComp type={UserMovieTypeEnum.WATCHING} title={t("UserPanel.watching")} />;
}

export default function WatchingPage() {
  return <Suspense fallback={<UserPanelSkeletonComp watched />}><WatchingContent /></Suspense>;
}
