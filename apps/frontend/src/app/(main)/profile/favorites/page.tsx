import { Suspense } from "react";
import type { Metadata } from "next";
import UserPanelComp from "@/features/userPanel/userPanel.index";
import UserPanelSkeletonComp from "@/features/userPanel/userPanelSkeleton/userPanelSkeleton.index";
import { UserMovieTypeEnum } from "@/types";
import { GetTranslation } from "@/scripts/server/translation";
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await GetTranslation();
  return { title: t("UserPanel.metaSavedTitle"), description: t("UserPanel.metaSavedDescription") };
}

async function FavoritesContent() {
  const { t } = await GetTranslation();
  return <UserPanelComp type={UserMovieTypeEnum.BOOKMARK} title={t("UserPanel.saved")} />;
}

export default function FavoritesPage() {
  return <Suspense fallback={<UserPanelSkeletonComp />}><FavoritesContent /></Suspense>;
}
