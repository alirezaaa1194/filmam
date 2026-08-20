import Image from "next/image";
import Link from "next/link";
import DesktopNav from "./nav/desktop/desktopNav.index";
import { ProfileDropdown } from "./profileDropdown/profileDropdown.index";
import { GetLocale, GetUser, GetTranslation, ServerCall } from "@/scripts/server";
import { Button } from "../ui/button";
import SearchInput from "./searchInput/searchInput.index";
import LanguageSwitcher from "@/utilities/components/languageSwitcher/languageSwitcher.index";
import Sidebar from "./sidebar/sidebar.index";
import { MenuItemType } from "@/types";
import { AppApis } from "@/data";

async function Header({ absolute }: { absolute: boolean }) {
  const user = await GetUser();
  const locale = await GetLocale(user);
  const { t } = await GetTranslation();
  const menuData = await ServerCall<MenuItemType[]>(AppApis.headerMenu.publicAll, { method: "GET", locale });

  return (
    <header className={`w-full lg:py-12 lg:px-24 ${absolute ? "absolute top-0" : ""}`}>
      <div className={`w-full h-12 lg:h-14 flex items-center justify-between gap-10 ${!absolute ? "bg-black " : ""} lg:bg-black/70 lg:rounded-lg lg:border lg:border-gray-12 lg:backdrop-blur-lg px-5 py-2 lg:p-3`}>
        <div className="flex items-center gap-3 lg:gap-20">
          <Sidebar menuData={menuData} user={user} />
          <Link href="/" className="flex items-center gap-1">
            <Image src="/logo.svg" alt="filmam" width={32} height={32} className="size-6 lg:size-8" />
            <Image src="/logo-text.svg" alt="filmam" width={91} height={26} className="w-[68px] h-[20px] lg:w-[91px] lg:h-[26px]" />
          </Link>
          <DesktopNav menuData={menuData} />
        </div>
        <div className="flex items-center gap-3 lg:gap-6">
          <SearchInput />
          <LanguageSwitcher />
          {user ? (
            <ProfileDropdown user={user} />
          ) : (
            <Link href="/">
              <Button className="w-20 h-8 rounded-md cursor-pointer text-button-s">{t("Header.login")}</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
