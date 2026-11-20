"use client";

import StatusPageComp from "@/features/statusPage/statusPage.index";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <StatusPageComp type="error" onRetry={reset} />;
}
