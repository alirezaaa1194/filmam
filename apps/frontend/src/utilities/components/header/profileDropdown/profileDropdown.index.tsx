"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/utilities/components/ui/dropdownMenu/dropdownMenu.index";
import { Button } from "@/utilities/components/ui/button/button.index";
import { ArchiveMinus, UserOctagon, I24Support, ArrowDown2, LogoutCurve, User, Setting2 } from "iconsax-react";
import { Separator } from "@/utilities/components/ui/separator/separator.index";
import { useState } from "react";
import { UserRoleEnum, UserType } from "@/types";
import Link from "next/link";
import { useLocale, useLogOut } from "@/hooks";

export function ProfileDropdown({ user }: { user: UserType }) {
  const [open, setOpen] = useState(false);
  const { dir, t } = useLocale();
  const { setConfirm, mutate, isRefreshing } = useLogOut();

  return (
    <div className="hidden lg:block">
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="!bg-complementary rounded-full border border-complementary-tint-2 w-[72] h-8 cursor-pointer flex items-center gap-1 !shadow-complementary-tint-2">
            <UserOctagon className="size-5 fill-complementary-shade-5" variant="Bold" />
            <ArrowDown2 className={`size-5 stroke-complementary-shade-5 transition-all ${open ? "rotate-180" : ""}`} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="!mt-5 !p-3 w-[182px] bg-gray-13 border border-gray-12 rounded-lg flex flex-col gap-2">
          <Link href="/" className="flex items-center justify-end gap-2 hover:bg-gray-12 transition-all w-full rounded-md" dir={dir === "rtl" ? "ltr" : "rtl"}>
            <span className="text-white text-body-xxs">{user.username}</span>
            <span className="flex items-center justify-center size-8 bg-gray-12 rounded-md">
              <User className="!stroke-white size-5" />
            </span>
          </Link>
          <Link href="/" className="flex items-center justify-end gap-2 hover:bg-gray-12 transition-all w-full rounded-md" dir={dir === "rtl" ? "ltr" : "rtl"}>
            <span className="text-white text-body-xxs">{t("Header.wishlist")}</span>
            <span className="flex items-center justify-center size-8 bg-gray-12 rounded-md">
              <ArchiveMinus className="!stroke-white size-5" />
            </span>
          </Link>
          <Link href="/" className="flex items-center justify-end gap-2 hover:bg-gray-12 transition-all w-full rounded-md" dir={dir === "rtl" ? "ltr" : "rtl"}>
            <span className="text-white text-body-xxs">{t("Header.support")}</span>
            <span className="flex items-center justify-center size-8 bg-gray-12 rounded-md">
              <I24Support className="!stroke-white size-5" />
            </span>
          </Link>
          {user.role === UserRoleEnum.ADMIN ? (
            <>
              <Link href="https://admin.filmamapp.ir" target="_blank" className="flex items-center justify-end gap-2 hover:bg-gray-12 transition-all w-full rounded-md" dir={dir === "rtl" ? "ltr" : "rtl"}>
                <span className="text-white text-body-xxs">{t("Header.adminPanel")}</span>
                <span className="flex items-center justify-center size-8 bg-gray-12 rounded-md">
                  <Setting2 className="!stroke-white size-5" />
                </span>
              </Link>
              <Separator className="bg-gray-12" />
            </>
          ) : null}
          <button onClick={() => setConfirm({ title: "خروج", description: "آیا میخواهید از حساب خود خارج شود؟", callback: mutate, isRefreshing })} className="flex items-center justify-end gap-2 hover:bg-gray-12 transition-all w-full rounded-md cursor-pointer" dir={dir === "rtl" ? "ltr" : "rtl"}>
            <span className="text-complementary-tint-2 text-body-xxs">{t("Header.logout")}</span>
            <span className="flex items-center justify-center size-8 bg-gray-12 rounded-md">
              <LogoutCurve className="!stroke-complementary-tint-2 size-5" />
            </span>
          </button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
