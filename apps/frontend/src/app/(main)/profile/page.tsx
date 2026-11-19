import type { Metadata } from "next";
import { Suspense } from "react";
import ProfileSettingsComp from "@/features/userPanel/profileSettings/profileSettings.index";
import UserPanelSkeletonComp from "@/features/userPanel/userPanelSkeleton/userPanelSkeleton.index";
import { GetTranslation } from "@/scripts/server/translation";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await GetTranslation();
  return { title: t("UserPanel.metaProfileTitle"), description: t("UserPanel.metaProfileDescription") };
}

export default function ProfilePage() {
  return <Suspense fallback={<UserPanelSkeletonComp profile />}><ProfileSettingsComp /></Suspense>;
}
