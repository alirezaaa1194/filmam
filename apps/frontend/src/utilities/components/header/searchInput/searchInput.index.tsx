"use client";

import { SearchNormal1 } from "iconsax-react";
import { useLocale } from "@/hooks";
import { useState } from "react";

function SearchInput() {
  const { t } = useLocale();
  const [searchValue, setSearchValue] = useState("");
  return (
    <div className="w-[150px] flex lg:hidden xl:flex sm:w-[296px] h-8 rounded-lg bg-gray-12 items-center gap-2 px-3 py-2">
      <input type="text" className="flex-1 min-w-0 outline-0 text-body-xxs placeholder:text-gray-10 text-white" placeholder={t("Header.searchPlaceholder")} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
      <SearchNormal1 className={`shrink-0 size-4 transition-all ${searchValue.trim() ? "stroke-white cursor-pointer" : "stroke-gray-10"}`} />
    </div>
  );
}

export default SearchInput;
