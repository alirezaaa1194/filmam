"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArchiveMinus, Heart, Play, TickCircle, User } from "iconsax-react";
import { useLocale } from "@/hooks";

const links = [
  { href: "/profile", key: "profile", icon: User },
  { href: "/profile/favorites", key: "saved", icon: ArchiveMinus },
  { href: "/profile/liked", key: "liked", icon: Heart },
  { href: "/profile/watched", key: "watched", icon: TickCircle },
  { href: "/profile/watching", key: "watching", icon: Play },
] as const;

export default function UserPanelLayoutComp({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { dir, t } = useLocale();
  return (
    <main dir={dir} className="mx-auto min-h-screen w-full max-w-layout-max px-layout-x-space pb-16 pt-[104px] lg:pt-[152px]">
      <nav aria-label={t("UserPanel.navigation")} className="mb-6 w-full max-w-full overflow-x-auto overscroll-x-contain pb-1 lg:mb-8">
        <div className="flex w-max flex-nowrap gap-2">
        {links.map(({ href, key, icon: Icon }) => {
          const active = href === "/profile" ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-md border px-4 text-button-s transition-colors ${active ? "border-primary bg-primary text-white" : "border-gray-10 bg-gray-13 text-gray-7 hover:border-primary hover:text-white"}`}>
              <Icon className={`size-4 ${active ? "fill-white stroke-white" : "fill-transparent stroke-gray-7"}`} variant={active ? "Bold" : "Outline"} />
              {t(`UserPanel.${key}` as "UserPanel.profile")}
            </Link>
          );
        })}
        </div>
      </nav>
      {children}
    </main>
  );
}
