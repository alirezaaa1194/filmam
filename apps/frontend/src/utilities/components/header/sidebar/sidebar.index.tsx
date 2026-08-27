"use client";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/utilities/components/ui/sheet/sheet.index";
import { HambergerMenu } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import { AuthModeEnum, UserRoleEnum, UserType } from "@/types";
import { Separator } from "@/utilities/components/ui/separator/separator.index";
import { useLocale, useLogOut } from "@/hooks";
import { PropsWithChildren, use, useState } from "react";
import LanguageSwitcher from "../../languageSwitcher/languageSwitcher.index";
import { AuthModalContext } from "../../../../contexts/authModal";

function Sidebar({ user, children }: PropsWithChildren<{ user: UserType | null }>) {
  const { t, dir } = useLocale();
  const side = dir === "rtl" ? "right" : "left";
  const [openSheet, setOpenSheet] = useState(false);
  const { setAuthMode } = use(AuthModalContext);
  const { setConfirm, mutate, isRefreshing } = useLogOut();

  return (
    <div className="block lg:hidden size-5">
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTrigger className="cursor-pointer">
          <HambergerMenu className="size-5 stroke-white" />
        </SheetTrigger>
        <SheetContent side={side} className="bg-gray-13 !border-0 !max-w-[256px] gap-0 px-6" showCloseButton={false}>
          <SheetHeader className="pt-4 pb-6 px-[30px]">
            <Link href="/" className="flex items-center gap-1">
              <Image src="/logo.svg" alt="filmam" width={32} height={32} className="size-6 lg:size-8" />
              <Image src="/logo-text.svg" alt="filmam" width={91} height={26} className="w-[68px] h-[20px] lg:w-[91px] lg:h-[26px]" />
            </Link>
          </SheetHeader>
          {children}
          <Separator className="!h-[2px] bg-gray-10 my-6" />
          {user ? (
            <div className="flex flex-col gap-2 text-body-xs">
              <Link href="/">{user.username}</Link>
              <Separator className="bg-gray-12" />
              <Link href="/">{t("Header.wishlist")}</Link>
              <Separator className="bg-gray-12" />
              <Link href="/">{t("Header.support")}</Link>
              <Separator className="bg-gray-12" />
              {user.role === UserRoleEnum.ADMIN ? (
                <>
                  <Link href="https://admin.filmamapp.ir">پنل مدیریت</Link>
                  <Separator className="bg-gray-12" />
                </>
              ) : null}
              <button
                className="text-complementary-tint-2 text-start cursor-pointer"
                onClick={() => {
                  setOpenSheet(false);
                  setConfirm({ title: "خروج", description: "آیا میخواهید از حساب خود خارج شود؟", callback: mutate, isRefreshing });
                }}
              >
                {t("Header.logout")}
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setOpenSheet(false);
                setAuthMode(AuthModeEnum.LOGIN);
              }}
              className="cursor-pointer text-start"
            >
              {t("Header.loginToAccount")}
            </button>
          )}
          <Separator className="!h-[2px] bg-gray-10 my-6" />
          <LanguageSwitcher />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Sidebar;
