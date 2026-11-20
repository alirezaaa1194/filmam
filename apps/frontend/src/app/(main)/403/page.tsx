import type { Metadata } from "next";
import { Suspense } from "react";
import AccessDeniedComp from "@/features/accessDenied/accessDenied.index";
import MetadataRuntimeMarkerComp from "@/features/metadataRuntimeMarker/metadataRuntimeMarker.index";
import { GetTranslation } from "@/scripts/server/translation";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await GetTranslation();
  return {
    title: `${t("UserPanel.accessTitle")} | ${t("Common.filmam")}`,
    description: t("UserPanel.accessDescription"),
  };
}

export default function ForbiddenPage() {
  return <>
    <Suspense fallback={null}><MetadataRuntimeMarkerComp /></Suspense>
    <AccessDeniedComp />
  </>;
}
