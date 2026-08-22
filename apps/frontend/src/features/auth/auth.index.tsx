"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../../utilities/components/ui/button";
import { useLocale } from "../../hooks";
import { useState } from "react";
import LoginForm from "./loginForm/loginForm.index";
import SignupForm from "./signupForm/signupForm.index";
import ForgetPasswordForm from "./forgetPasswordForm/forgetPasswordForm.index";
export type AuthModeType = "Login" | "Signup" | "ForgetPassword";
function AuthModal({ authMode }: { authMode: AuthModeType }) {
  const { t } = useLocale();
  const [mode, setMode] = useState<AuthModeType>(authMode);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setMode("Login");
        }
      }}
    >
      <DialogTrigger>
        <Button className="w-20 h-8 rounded-md cursor-pointer text-button-s hidden lg:block">{t("Header.login")}</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center">{mode === "Login" ? <LoginForm setMode={setMode} /> : mode === "Signup" ? <SignupForm setMode={setMode} /> : mode === "ForgetPassword" ? <ForgetPasswordForm setMode={setMode} /> : null}</DialogContent>
    </Dialog>
  );
}

export default AuthModal;
