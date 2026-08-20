"use client";

import { use } from "react";
import { Check } from "lucide-react";
import { Button } from "@/utilities/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/utilities/components/ui/dropdown-menu";
import { AppLanguagesEnum } from "@/types";
import Image from "next/image";
import { useLocale } from "@/hooks";
import { UserContext } from "@/contexts";
import { SetCookie } from "@/scripts/server/actions";
import { AppLanguages } from "@/scripts";
import { ClientCall } from "@/scripts/client";
import { AppApis } from "@/data";
import { useRouter } from "next/navigation";

const flags: Record<AppLanguagesEnum, string> = {
  [AppLanguagesEnum.FA]: "/flags/fa.svg",
  [AppLanguagesEnum.EN]: "/flags/en.svg",
  [AppLanguagesEnum.AR]: "/flags/ar.svg",
};

const languageLabels: Record<AppLanguagesEnum, string> = {
  [AppLanguagesEnum.EN]: "English",
  [AppLanguagesEnum.FA]: "فارسی",
  [AppLanguagesEnum.AR]: "العربية",
};

const languageFonts: Record<AppLanguagesEnum, string> = {
  [AppLanguagesEnum.EN]: "font-en",
  [AppLanguagesEnum.FA]: "font-fa",
  [AppLanguagesEnum.AR]: "font-ar",
};

function LanguageSwitcher() {
  const { locale, setLocale, dir } = useLocale();
  const user = use(UserContext);
  const router = useRouter();

  function handleSelect(lang: AppLanguagesEnum) {
    if (lang === locale) return;

    setLocale(lang as AppLanguagesEnum);
    SetCookie("locale", lang);
    ClientCall(AppApis.user.updateInfo, { method: "PUT", body: { ...user, preferred_language: lang } });
    router.refresh();
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 overflow-hidden rounded-full cursor-pointer">
          <Image width={32} height={32} src={flags[locale]} alt={`${locale}-flag`} className="size-full rounded-full object-cover" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="!mt-5 !p-3 bg-gray-13 border border-gray-12 rounded-lg flex flex-col gap-2">
        {AppLanguages.map((lang) => (
          <DropdownMenuItem key={lang} className="flex items-center justify-start gap-2 hover:!bg-gray-12 transition-all w-full rounded-md" onSelect={() => handleSelect(lang)} dir={dir}>
            <span className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
              <Image src={flags[lang]} alt={`${lang}-flag`} width={20} height={20} className="size-full rounded-full object-cover" />
            </span>
            <span className={`${languageFonts[lang]} !text-white`}>{languageLabels[lang]}</span>
            <Check size={14} className={`ms-auto !text-white ${locale !== lang ? "hidden" : ""}`} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
