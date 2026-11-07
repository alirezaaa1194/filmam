import type { ReactNode } from "react";

export default function ContactSocialIcon({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="flex size-8 items-center justify-center rounded-md bg-primary-shade-7">{children}</a>;
}
