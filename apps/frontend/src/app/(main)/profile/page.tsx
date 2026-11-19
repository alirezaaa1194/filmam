import type { Metadata } from "next";
import { Suspense } from "react";
import ProfileSettingsComp from "@/features/userPanel/profileSettings/profileSettings.index";
import UserPanelSkeletonComp from "@/features/userPanel/userPanelSkeleton/userPanelSkeleton.index";

export const metadata: Metadata = {
  title: "Profile | Filmam",
};

export default function ProfilePage() {
  return <Suspense fallback={<UserPanelSkeletonComp profile />}><ProfileSettingsComp /></Suspense>;
}
