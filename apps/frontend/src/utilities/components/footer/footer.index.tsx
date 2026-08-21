"use client";
import { Fragment } from "react";
import { Instagram, TickCircle, Youtube } from "iconsax-react";
import Image from "next/image";
import Link from "next/link";
import AparatIcon from "@/assets/icons/aparat.svg";
import TelegramIcon from "@/assets/icons/telegram.svg";
import { Separator } from "@/components/ui/separator";
import { useLocale } from "@/hooks";
import { GetLocaleYear } from "@/scripts";

function Footer() {
  const { t, locale } = useLocale();
  const currentYear = GetLocaleYear(locale);
  const descriptionParts = t("Footer.description").split("--");

  return (
    <footer className="flex flex-col py-12 px-layout-x-space">
      <div className="flex flex-col gap-4">
        <Link href="/" className="flex items-center gap-1">
          <Image src="/logo.svg" alt="filmam" width={32} height={32} className="size-6 lg:size-8" />
          <Image src="/logo-text.svg" alt="filmam" width={91} height={26} className="w-[68px] h-[20px] lg:w-[91px] lg:h-[26px]" />
        </Link>
        <div className="flex items-start gap-40">
          <p className="text-body-xxs flex-1 text-justify lg:text-start">
            {descriptionParts.map((part, index) => (
              <Fragment key={index}>
                {part}
                {index < descriptionParts.length - 1 && <br />}
              </Fragment>
            ))}
          </p>
          <div className="hidden lg:flex flex-col gap-2 shrink-0">
            <span className="text-body-xxs text-gray-8">{t("Footer.followUs")}</span>
            <div className="flex justify-between gap-2">
              <Link href="/" className="flex items-center justify-center size-8 bg-primary-shade-7 rounded-md">
                <Image src={AparatIcon} width={24} height={24} alt="Aparat-icon" />
              </Link>
              <Link href="/" className="flex items-center justify-center size-8 bg-primary-shade-7 rounded-md">
                <Instagram className="stroke-primary-tint-3 size-6" />
              </Link>
              <Link href="/" className="flex items-center justify-center size-8 bg-primary-shade-7 rounded-md">
                <Image src={TelegramIcon} width={24} height={24} alt="Telegram-icon" />
              </Link>
              <Link href="/" className="flex items-center justify-center size-8 bg-primary-shade-7 rounded-md">
                <Youtube className="stroke-primary-tint-3 size-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center flex-wrap gap-x-4 gap-y-3 text-caption-md">
          <span className="text-primary-tint-1 flex items-center gap-1">
            <TickCircle className="fill-primary-tint-1 size-4" variant="Bold" />
            {t("Footer.thousandsOfMoviesAndSeries")}
          </span>
          <span className="text-primary-tint-1 flex items-center gap-1">
            <TickCircle className="fill-primary-tint-1 size-4" variant="Bold" />
            {t("Footer.animationsForKids")}
          </span>
          <span className="text-primary-tint-1 flex items-center gap-1">
            <TickCircle className="fill-primary-tint-1 size-4" variant="Bold" />
            {t("Footer.halfPriceTraffic")}
          </span>
          <span className="text-primary-tint-1 flex items-center gap-1">
            <TickCircle className="fill-primary-tint-1 size-4" variant="Bold" />
            {t("Footer.support24h")}
          </span>
        </div>
        <div className="flex lg:hidden flex-col mx-auto gap-2 shrink-0 max-w-max">
          <span className="text-body-xxs text-gray-8 text-center">{t("Footer.followUs")}</span>
          <div className="flex justify-between gap-2">
            <Link href="/" className="flex items-center justify-center size-8 bg-primary-shade-7 rounded-md">
              <Image src={AparatIcon} width={24} height={24} alt="Aparat-icon" />
            </Link>
            <Link href="/" className="flex items-center justify-center size-8 bg-primary-shade-7 rounded-md">
              <Instagram className="stroke-primary-tint-3 size-6" />
            </Link>
            <Link href="/" className="flex items-center justify-center size-8 bg-primary-shade-7 rounded-md">
              <Image src={TelegramIcon} width={24} height={24} alt="Telegram-icon" />
            </Link>
            <Link href="/" className="flex items-center justify-center size-8 bg-primary-shade-7 rounded-md">
              <Youtube className="stroke-primary-tint-3 size-6" />
            </Link>
          </div>
        </div>
        <Separator className="bg-gray-12" />
        <div className="flex items-center justify-between text-gray-9 gap-4 text-caption-md">
          <p className="truncate">{t("Footer.copyright")}</p>
          <span className="text-nowrap">
            <span>{t("Footer.startYear")}</span>-<span>{currentYear}</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
