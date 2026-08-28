"use client";
import { Dialog, DialogContent } from "@/utilities/components/ui/dialog/dialog.index";
import { use } from "react";
import LoginForm from "./loginForm/loginForm.index";
import SignupForm from "./signupForm/signupForm.index";
import ForgetPasswordForm from "./forgetPasswordForm/forgetPasswordForm.index";
import { AuthModalContext } from "../../contexts/authModal";

function AuthModal() {
  const { authMode, setAuthMode } = use(AuthModalContext);

  return (
    <Dialog
      open={authMode !== null}
      onOpenChange={(open) => {
        if (!open) {
          setAuthMode(null);
        }
      }}
    >
      <DialogContent className="flex flex-col items-center">{authMode === "Login" || null ? <LoginForm setMode={setAuthMode} /> : authMode === "Signup" ? <SignupForm setMode={setAuthMode} /> : authMode === "ForgetPassword" ? <ForgetPasswordForm setMode={setAuthMode} /> : null}</DialogContent>
    </Dialog>
  );
}

export default AuthModal;
