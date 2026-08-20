"use client";

import { SearchNormal1 } from "iconsax-react";

function SearchInput() {
  return (
    <div className="w-[150px] flex lg:hidden xl:flex sm:w-[296px] h-8 rounded-lg bg-gray-12 items-center gap-2 px-3 py-2">
      <input type="text" className="flex-1 min-w-0 outline-0 text-body-xxs placeholder:text-gray-10 text-gray-7" placeholder="جستجو..." />
      <SearchNormal1 className="shrink-0 stroke-gray-10 size-4" />
    </div>
  );
}

export default SearchInput;
