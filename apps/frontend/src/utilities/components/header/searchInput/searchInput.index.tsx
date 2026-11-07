"use client";

import { SearchNormal1 } from "iconsax-react";
import { useLocale } from "@/hooks";
import { FormEvent, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function SearchInput() {
  const { t } = useLocale();
  const { locale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    setSearchValue(pathname === "/movies" ? searchParams.get("search") ?? "" : "");
  }, [pathname, searchParams]);
  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams(pathname === "/movies" ? searchParams.toString() : "");
    params.set("lang", locale);
    params.set("page", "1");
    params.set("page_size", "20");
    if (searchValue.trim()) params.set("search", searchValue.trim());
    else params.delete("search");
    const href = `/movies?${params.toString()}`;
    setSearchValue(searchValue.trim());
    window.history.pushState(null, "", href);
    if (pathname === "/movies") {
      window.dispatchEvent(new Event("movie-catalog-url-change"));
    } else {
      router.replace(href);
    }
  };
  return (
    <form onSubmit={submitSearch} className="w-[150px] flex lg:hidden xl:flex sm:w-[296px] h-8 rounded-md bg-gray-12 items-center gap-2 px-3 py-2">
      <input type="text" className="flex-1 min-w-0 outline-0 text-body-xxs placeholder:text-gray-10 text-white" placeholder={t("Header.searchPlaceholder")} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
      <button type="submit" aria-label={t("MovieCatalog.search")} className="flex shrink-0 cursor-pointer items-center"><SearchNormal1 className={`size-4 transition-all ${searchValue.trim() ? "stroke-white" : "stroke-gray-10"}`} /></button>
    </form>
  );
}

export default SearchInput;
