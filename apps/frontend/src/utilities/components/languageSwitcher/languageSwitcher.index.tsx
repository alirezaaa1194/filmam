"use client";

import { use, useTransition } from "react";
import { Check } from "lucide-react";
import { Button } from "@/utilities/components/ui/button/button.index";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/utilities/components/ui/dropdownMenu/dropdownMenu.index";
import { AppLanguagesEnum } from "@/types";
import Image from "next/image";
import { useLocale } from "@/hooks";
import { UserContext } from "@/contexts";
import { SetCookie } from "@/scripts/server/actions";
import { AppLanguages } from "@/scripts";
import { ClientCall } from "@/scripts/client";
import { AppApis } from "@/data";
import { useRouter } from "next/navigation";
import { ArrowDown2 } from "iconsax-react";
import { Spinner } from "@/utilities/components/ui/spinner/spinner.index";

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
  [AppLanguagesEnum.EN]: "var(--font-en)",
  [AppLanguagesEnum.FA]: "var(--font-fa)",
  [AppLanguagesEnum.AR]: "var(--font-ar)",
};

function LanguageSwitcher() {
  const { locale, setLocale, dir } = useLocale();
  const user = use(UserContext);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSelect(lang: AppLanguagesEnum) {
    if (lang === locale || isPending) return;

    setLocale(lang as AppLanguagesEnum);
    SetCookie("locale", lang);
    ClientCall(AppApis.user.updateInfo, {
      method: "PUT",
      body: { ...user, preferred_language: lang },
    });
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild className="w-full! lg:w-auto! group">
        <Button
          variant="ghost"
          size="icon"
          className="w-full flex items-center justify-between gap-2 lg:size-8 lg:overflow-hidden lg:rounded-full !bg-transparent cursor-pointer lg:!bg-gray-12 lg:hover:bg-gray-11 lg:aria-expanded:bg-gray-11 relative"
        >
          <span className="flex items-center justify-start gap-2">
            <Image
              width={32}
              height={32}
              src={flags[locale]}
              alt={`${locale}-flag`}
              className="size-6 lg:size-8 lg:!bg-gray-12 rounded-full object-cover"
            />
            <span className="text-white! text-body-xs lg:hidden">
              {languageLabels[locale]}
            </span>
          </span>
          {isPending ? (
            <span className="lg:flex items-center justify-center lg:rounded-full lg:w-full lg:h-full bg-black/50 lg:absolute">
              <Spinner />
            </span>
          ) : (
            <ArrowDown2 className="size-5 stroke-white transition-all group-data-[state=open]:rotate-180 lg:hidden" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[208px] lg:min-w-[130px] w-full lg:w-auto lg:mt-5 p-3 !bg-gray-13 border border-gray-12 rounded-lg flex flex-col gap-2"
      >
        {AppLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            className="cursor-pointer flex items-center justify-start gap-2 rounded-md transition-all w-full hover:bg-gray-12! focus:bg-gray-12! data-[highlighted]:bg-gray-12! focus:text-white! data-[highlighted]:text-white!"
            onSelect={() => handleSelect(lang)}
            dir={dir}
          >
            <span className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
              <Image
                src={flags[lang]}
                alt={`${lang}-flag`}
                width={20}
                height={20}
                className="size-full rounded-full object-cover"
              />
            </span>
            <span
              style={{ fontFamily: languageFonts[lang] }}
              className="text-white!"
            >
              {languageLabels[lang]}
            </span>
            <Check
              size={14}
              className={`ms-auto text-white! ${locale !== lang ? "hidden" : ""}`}
              color="white"
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
