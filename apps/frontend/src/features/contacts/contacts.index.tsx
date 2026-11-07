"use client";

import { use, useState } from "react";
import type { FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { CallCalling, Send2, Sms } from "iconsax-react";
import { Instagram, Youtube } from "iconsax-react";
import Image from "next/image";
import { toast } from "sonner";
import { UserContext } from "@/contexts";
import { AppApis } from "@/data";
import { useLocale } from "@/hooks";
import { ClientCall } from "@/scripts/client";
import { Button, Input, Spinner } from "@/utilities/components/ui";
import { Textarea } from "@/utilities/components/ui/textarea";
import AparatIcon from "@/assets/icons/aparat.svg";
import TelegramIcon from "@/assets/icons/telegram.svg";
import ContactInfoCard from "./contactInfoCard/contactInfoCard.index";
import ContactFormField from "./contactFormField/contactFormField.index";
import ContactSocialIcon from "./contactSocialIcon/contactSocialIcon.index";

type ContactPayload = { user_email: string; message: string };

export default function ContactPageComp() {
  const user = use(UserContext);
  const { t, dir } = useLocale();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const contactMutation = useMutation({
    mutationFn: (body: ContactPayload) => ClientCall(AppApis.contact.create, { method: "POST", body }),
    onSuccess: () => {
      toast.success(t("Contact.success"));
      setEmail("");
      setMessage("");
    },
    onError: () => toast.error(t("Contact.error")),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userEmail = user?.email || email.trim();
    if (!userEmail) return;
    contactMutation.mutate({ user_email: userEmail, message: message.trim() });
  };

  return (
    <main className="mx-auto w-full max-w-layout-max px-layout-x-space pb-8 pt-[104px] lg:pb-14 lg:pt-[152px]" dir={dir}>
      <h1 className="mb-4 block text-right text-h-5 font-bold">{t("Contact.title")}</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="flex flex-col gap-6" aria-label={t("Contact.title")}>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
            <ContactInfoCard icon={<CallCalling className="size-8 stroke-primary" />} description={t("Contact.phoneDescription")} value={t("Contact.phoneNumber")} href="tel:+982177521" />
            <ContactInfoCard icon={<Send2 className="size-8 stroke-primary" />} description={t("Contact.telegramDescription")} value="@filmam" href="https://t.me/filmam" />
            <ContactInfoCard className="col-span-2 lg:col-span-1" compactMobile icon={<Sms className="size-8 stroke-primary" />} description={t("Contact.emailDescription")} value={t("Contact.emailLabel")} />
          </div>
          <div className="flex min-h-20 flex-wrap items-center justify-center! gap-x-6 gap-y-3 rounded-xl bg-gray-13 px-5 py-5 lg:min-h-[126px] lg:justify-end lg:gap-8 lg:px-10">
            <span className="text-center text-body-xxs text-white">{t("Contact.socialTitle")}</span>
            <div className="flex items-center gap-2">
              <ContactSocialIcon href="https://www.youtube.com" label="YouTube">
                <Youtube className="size-6 stroke-primary-tint-3" />
              </ContactSocialIcon>
              <ContactSocialIcon href="https://t.me/filmam" label="Telegram">
                <Image src={TelegramIcon} width={24} height={24} alt="" />
              </ContactSocialIcon>
              <ContactSocialIcon href="https://www.instagram.com" label="Instagram">
                <Instagram className="size-6 stroke-primary-tint-3" />
              </ContactSocialIcon>
              <ContactSocialIcon href="https://www.aparat.com" label="Aparat">
                <Image src={AparatIcon} width={24} height={24} alt="" />
              </ContactSocialIcon>
            </div>
          </div>
        </section>
        <form onSubmit={handleSubmit} className={`flex flex-col gap-5 rounded-xl bg-gray-13 p-5 sm:p-6 ${user ? "h-fit" : ""}`}>
          {!user ? (
            <ContactFormField label={t("Contact.email")}>
              <Input dir={dir} className="rounded-lg" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t("Contact.emailPlaceholder")} required />
            </ContactFormField>
          ) : null}
          <ContactFormField label={t("Contact.message")}>
            <Textarea className="h-[172px] resize-none rounded-lg" value={message} onChange={(event) => setMessage(event.target.value)} placeholder={t("Contact.messagePlaceholder")} required />
          </ContactFormField>
          <Button type="submit" disabled={contactMutation.isPending || !message.trim() || (!user && !email.trim())} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-primary text-button-md text-white hover:bg-primary/85 disabled:bg-gray-12 disabled:text-gray-8">
            {contactMutation.isPending ? (
              <>
                <Spinner className="size-5" />
                {t("Contact.submit")}
              </>
            ) : (
              t("Contact.submit")
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}
