
import type { Metadata } from "next";
import { Suspense } from "react";
import StatusPageComp from "@/features/statusPage/statusPage.index";
import MetadataRuntimeMarkerComp from "@/features/metadataRuntimeMarker/metadataRuntimeMarker.index";
import { GetTranslation } from "@/scripts/server/translation";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await GetTranslation();
  return {
    title: `${t("errors.pageNotFoundTitle")} | ${t("Common.filmam")}`,
    description: t("errors.pageNotFoundDescription"),
  };
}

export default function NotFound() {
  return <>
    <Suspense fallback={null}><MetadataRuntimeMarkerComp /></Suspense>
    <StatusPageComp type="notFound" />
  </>;
}
