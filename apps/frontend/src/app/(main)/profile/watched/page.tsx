import { Suspense } from "react";
import UserPanelComp from "@/features/userPanel/userPanel.index";
import UserPanelSkeletonComp from "@/features/userPanel/userPanelSkeleton/userPanelSkeleton.index";
import { UserMovieTypeEnum } from "@/types";
import { GetTranslation } from "@/scripts/server/translation";

async function WatchedContent() {
  const { t } = await GetTranslation();
  return <UserPanelComp type={UserMovieTypeEnum.WATCHED} title={t("UserPanel.watched")} />;
}

export default function WatchedPage() {
  return <Suspense fallback={<UserPanelSkeletonComp watched />}><WatchedContent /></Suspense>;
}
