import ContactPageComp from "@/features/contacts/contacts.index";
import ContactSkeletonComp from "@/features/contacts/contactSkeleton/contactSkeleton.index";
import type { Metadata } from "next";
import { GetTranslation } from "@/scripts/server/translation";
import { connection } from "next/server";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await GetTranslation();
  return { title: t("Contact.title"), description: t("Contact.metaDescription") };
}

async function DynamicContactPageComp() {
  await connection();
  return <ContactPageComp />;
}

export default function ContactPage() {
  return (
    <Suspense fallback={<ContactSkeletonComp />}>
      <DynamicContactPageComp />
    </Suspense>
  );
}
