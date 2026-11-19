"use client";

import { use, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserContext } from "@/contexts";
import { AppApis } from "@/data";
import { useLocale } from "@/hooks";
import { ClientCall } from "@/scripts/client";
import { Button, Input, Spinner } from "@/utilities/components/ui";
import { PasswordInput } from "@/utilities/components/ui/passwordInput/passwordInput.index";

export default function ProfileSettingsComp() {
  const user = use(UserContext);
  const { dir, t } = useLocale();
  const [username, setUsername] = useState(user?.username ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const infoMutation = useMutation({
    mutationFn: () => ClientCall(AppApis.user.updateInfo, { method: "PUT", body: { username, preferred_language: user?.preferred_language } }),
    onSuccess: () => toast.success(t("UserPanel.profileSaved")),
    onError: () => toast.error(t("errors.unknown")),
  });
  const passwordMutation = useMutation({
    mutationFn: () => ClientCall(AppApis.auth.changePassword, { method: "PUT", body: { current_password: currentPassword, new_password: newPassword } }),
    onSuccess: () => {
      toast.success(t("UserPanel.passwordSaved"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: () => toast.error(t("UserPanel.passwordError")),
  });

  return (
    <section>
      <h1 className="mb-5 text-h-5 font-bold text-white">{t("UserPanel.profile")}</h1>
      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        <form onSubmit={(event) => { event.preventDefault(); infoMutation.mutate(); }} className="flex flex-col gap-5 rounded-xl border border-gray-11 bg-gray-13 p-5 sm:p-6">
          <h2 className="text-h-6 font-semibold text-white">{t("UserPanel.accountInfo")}</h2>
          <label className="flex flex-col gap-2 text-body-xxs text-gray-7">
            {t("Auth.fields.email")}
            <Input type="email" dir="ltr" value={user?.email ?? ""} placeholder={t("UserPanel.emailPlaceholder")} disabled className="rounded-lg text-left" />
          </label>
          <label className="flex flex-col gap-2 text-body-xxs text-gray-7">
            {t("Auth.fields.username")}
            <Input dir={dir} value={username} placeholder={t("UserPanel.usernamePlaceholder")} minLength={3} required onChange={(event) => setUsername(event.target.value)} className="rounded-lg" />
          </label>
          <Button type="submit" disabled={infoMutation.isPending || username.trim().length < 3} className="h-11 w-full cursor-pointer rounded-md text-button-s sm:w-fit sm:px-8">
            {infoMutation.isPending ? <><Spinner className="size-4" />{t("UserPanel.saving")}</> : t("UserPanel.save")}
          </Button>
        </form>

        <form onSubmit={(event) => { event.preventDefault(); if (newPassword !== confirmPassword) return; passwordMutation.mutate(); }} className="flex flex-col gap-5 rounded-xl border border-gray-11 bg-gray-13 p-5 sm:p-6">
          <h2 className="text-h-6 font-semibold text-white">{t("UserPanel.changePassword")}</h2>
          <label className="flex flex-col gap-2 text-body-xxs text-gray-7">
            {t("UserPanel.currentPassword")}
            <PasswordInput dir="ltr" autoComplete="current-password" minLength={8} required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder={t("UserPanel.currentPasswordPlaceholder")} className="rounded-lg" />
          </label>
          <label className="flex flex-col gap-2 text-body-xxs text-gray-7">
            {t("UserPanel.newPassword")}
            <PasswordInput dir="ltr" autoComplete="new-password" minLength={8} required value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder={t("UserPanel.newPasswordPlaceholder")} className="rounded-lg" />
          </label>
          <label className="flex flex-col gap-2 text-body-xxs text-gray-7">
            {t("Auth.fields.confirmPassword")}
            <PasswordInput dir="ltr" autoComplete="new-password" minLength={8} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder={t("UserPanel.confirmPasswordPlaceholder")} aria-invalid={!!confirmPassword && confirmPassword !== newPassword} className="rounded-lg" />
          </label>
          {!!confirmPassword && confirmPassword !== newPassword ? <p className="text-caption-sm text-error">{t("Auth.validation.passwordsDoNotMatch")}</p> : null}
          <Button type="submit" disabled={passwordMutation.isPending || newPassword.length < 8 || newPassword !== confirmPassword || currentPassword.length < 8} className="h-11 w-full cursor-pointer rounded-md text-button-s sm:w-fit sm:px-8">
            {passwordMutation.isPending ? <><Spinner className="size-4" />{t("UserPanel.saving")}</> : t("UserPanel.updatePassword")}
          </Button>
        </form>
      </div>
    </section>
  );
}
