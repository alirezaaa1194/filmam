import type { ReactNode } from "react";

export default function ContactFormField({ label, children }: { label: string; children: ReactNode }) {
  return <label className="flex flex-col gap-1 text-body-xs text-white"><span><span>*</span> {label}</span>{children}</label>;
}
