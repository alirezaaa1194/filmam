"use client";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { HambergerMenu } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import { MenuItemType, MenuTypeEnum, UserType } from "@/types";
import { Separator } from "@/components/ui/separator";
import SidebarItem from "./sidebarItem/sidebarItem.index";
import { useLocale } from "@/hooks";

function Sidebar({ menuData, user }: { menuData: MenuItemType[]; user: UserType | null }) {
  const { t, dir } = useLocale();
  const side = dir === "rtl" ? "right" : "left";
  return (
    <div className="block lg:hidden">
      <Sheet>
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
          {menuData.map((menuItem, i) =>
            menuItem.children.length ? (
              <>
                <SidebarItem key={menuItem.id} menuItem={menuItem} />
                {i + 1 !== menuData.length ? <Separator className="bg-gray-12" /> : null}
              </>
            ) : (
              <>
                <Link key={menuItem.id} href={menuItem.menu_type === MenuTypeEnum.PAGE ? `${menuItem.href}` : `/movies${menuItem.filter}`} className="block py-2">
                  {menuItem.title}
                </Link>
                {i + 1 !== menuData.length ? <Separator className="bg-gray-12" /> : null}
              </>
            ),
          )}
          <Separator className="!h-[2px] bg-gray-10 my-6" />
          {user ? (
            <div className="flex flex-col gap-2 text-body-xs">
              <Link href="/">{user.username}</Link>
              <Separator className="bg-gray-12" />
              <Link href="/">{t("Header.wishlist")}</Link>
              <Separator className="bg-gray-12" />
              <Link href="/">{t("Header.support")}</Link>
              <Separator className="bg-gray-12" />
              <button className="text-complementary-tint-2 text-start cursor-pointer">{t("Header.logout")}</button>
            </div>
          ) : (
            <Link href="/">{t("Header.loginToAccount")}</Link>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Sidebar;
