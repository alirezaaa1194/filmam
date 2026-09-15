import Image from "next/image";
import Link from "next/link";
import SearchInput from "./searchInput/searchInput.index";
import LanguageSwitcher from "@/utilities/components/languageSwitcher/languageSwitcher.index";
import Sidebar from "./sidebar/sidebar.index";
import MobileNavbarSkeleton from "./sidebar/navbar/navbarItem/skeleton/navbarItemSkeleton.index";
import MobileNavbar from "./sidebar/navbar/navbar.index";
import ProfileSectionComp from "./profileSection/profileSection.index";
import Navbar from "./navbar/navbar.index";
import NavbarItemSkeleton from "./navbar/navbarItem/skeleton/navbarItemSkeleton.index";
import { Suspense } from "react";

async function Header({ absolute }: { absolute: boolean }) {
  return (
    <header className={`w-full max-w-layout-max h-fit lg:py-12 lg:px-24 mx-auto ${absolute ? "absolute inset-0 z-10" : ""}`}>
      <div className={`w-full h-12 lg:h-14 flex items-center justify-between gap-10 ${!absolute ? "bg-black " : ""} lg:bg-black/70 lg:rounded-lg lg:border lg:border-gray-12 lg:backdrop-blur-[15px] px-5 py-2 lg:p-3`}>
        <div className="flex items-center gap-3 lg:gap-20">
          <Sidebar>
            <Suspense
              fallback={
                <div className="flex flex-col gap-2.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex flex-col">
                      <MobileNavbarSkeleton className="h-5 w-14" />
                      {i + 1 !== 5 ? <div className="w-full h-[2px] bg-gray-12 mt-2.5" /> : null}
                    </div>
                  ))}
                </div>
              }
            >
              <MobileNavbar />
            </Suspense>
          </Sidebar>
          <Link href="/" className="flex items-center gap-1">
            <Image src="/logo.svg" alt="filmam" width={32} height={32} className="size-6 lg:size-8" />
            <Image src="/logo-text.svg" alt="filmam" width={91} height={26} className="w-[68px] h-[20px] lg:w-[91px] lg:h-[26px]" />
          </Link>
          <Suspense
            fallback={
              <div className="hidden lg:flex items-center gap-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <NavbarItemSkeleton key={i} className="h-4 w-14" />
                ))}
              </div>
            }
          >
            <Navbar />
          </Suspense>
        </div>
        <div className="flex items-center gap-3 lg:gap-6">
          <SearchInput />
          <div className="hidden lg:flex">
            <LanguageSwitcher />
          </div>
          <ProfileSectionComp />
        </div>
      </div>
    </header>
  );
}

export default Header;
