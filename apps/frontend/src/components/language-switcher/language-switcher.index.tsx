"use client";

import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { locales } from "@/i18n/config";
import { useLocaleContext } from "../../providers/locale-provider";
import { UserContext } from "../../contexts";
import { AppApis } from "../../data";
import { __ClientCall as ClientCall } from "../../scripts/clientCall";
import { AppLanguagesEnum } from "../../types";

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

function LanguageSwitcher() {
  const { locale, setLocale } = useLocaleContext();
  const user = useContext(UserContext);

  const { mutate } = useMutation({
    mutationFn: (lang: AppLanguagesEnum) =>
      ClientCall(AppApis.user.updateInfo, {
        method: "PUT",
        body: { ...user, preferred_language: lang },
      }),
  });

  function handleSelect(lang: AppLanguagesEnum) {
    if (lang === locale) return;

    setLocale(lang);

    if (user) {
      mutate(lang);
    }
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 overflow-hidden rounded-full">
          <img
            src={flags[locale]}
            alt={`${locale}-flag`}
            className="size-full rounded-full object-cover"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((lang) => (
          <DropdownMenuItem key={lang} className="gap-2" onSelect={() => handleSelect(lang)}>
            <span className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full">
              <img
                src={flags[lang]}
                alt={`${lang}-flag`}
                className="size-full rounded-full object-cover"
              />
            </span>
            <span>{languageLabels[lang]}</span>
            <Check size={14} className={`ms-auto ${locale !== lang ? "hidden" : ""}`} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
