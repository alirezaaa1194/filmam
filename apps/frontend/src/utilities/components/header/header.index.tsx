import Image from "next/image";
import Link from "next/link";
import { ProfileDropdown } from "./profileDropdown/profileDropdown.index";
import { GetLocale, GetUser } from "@/scripts/server";
import SearchInput from "./searchInput/searchInput.index";
import LanguageSwitcher from "@/utilities/components/languageSwitcher/languageSwitcher.index";
import Sidebar from "./sidebar/sidebar.index";
import MobileNavbar from "./sidebar/navbar/navbar.index";
import DesktopNavbar from "./navbar/navbar.index";
import HeaderLoginButton from "./loginButton/loginButton.index";

async function Header({ absolute }: { absolute: boolean }) {
  const user = await GetUser();
  const locale = await GetLocale(user);

  return (
    <header
      className={`w-full max-w-layout-max h-fit lg:py-12 lg:px-24 mx-auto ${absolute ? "absolute inset-0 z-10" : ""}`}
    >
      <div
        className={`w-full h-12 lg:h-14 flex items-center justify-between gap-10 ${!absolute ? "bg-black " : ""} lg:bg-black/30 lg:rounded-lg lg:border lg:border-gray-12 lg:backdrop-blur-[15px] px-5 py-2 lg:p-3`}
      >
        <div className="flex items-center gap-3 lg:gap-20">
          <Sidebar user={user}>
            <MobileNavbar locale={locale} />
          </Sidebar>
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/logo.svg"
              alt="filmam"
              width={32}
              height={32}
              className="size-6 lg:size-8"
            />
            <Image
              src="/logo-text.svg"
              alt="filmam"
              width={91}
              height={26}
              className="w-[68px] h-[20px] lg:w-[91px] lg:h-[26px]"
            />
          </Link>
          <DesktopNavbar locale={locale} />
        </div>
        <div className="flex items-center gap-3 lg:gap-6">
          <SearchInput />
          <div className="hidden lg:flex">
            <LanguageSwitcher />
          </div>
          {user ? <ProfileDropdown user={user} /> : <HeaderLoginButton />}
        </div>
      </div>
    </header>
  );
}

export default Header;
