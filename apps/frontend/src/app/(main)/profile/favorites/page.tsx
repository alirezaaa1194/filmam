import { Suspense } from "react";
import UserPanelComp from "@/features/userPanel/userPanel.index";
import UserPanelSkeletonComp from "@/features/userPanel/userPanelSkeleton/userPanelSkeleton.index";
import { UserMovieTypeEnum } from "@/types";
import { GetTranslation } from "@/scripts/server/translation";

async function FavoritesContent() {
  const { t } = await GetTranslation();
  return <UserPanelComp type={UserMovieTypeEnum.BOOKMARK} title={t("UserPanel.saved")} />;
}

export default function FavoritesPage() {
  return <Suspense fallback={<UserPanelSkeletonComp />}><FavoritesContent /></Suspense>;
}
