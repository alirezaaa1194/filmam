import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import { useLocale, useTimer } from "@/hooks";
import ForgetEmailForm from "./emailForm/emailForm.index";
import ForgetOtpForm from "./otpForm/otpForm.index";
import { AuthModeType } from "../../../types";

export const ForgetPasswordSchema = z
  .object({
    email: z.email("Auth.validation.emailInvalid"),

    newPassword: z.string().optional(),

    confirmPassword: z.string().optional(),

    otp: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== undefined && data.newPassword !== "") {
      if (data.newPassword.length < 8) {
        ctx.addIssue({
          code: "custom",
          message: "Auth.validation.passwordMinLength",
          path: ["newPassword"],
        });
      }

      if (!data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Auth.validation.confirmPasswordRequired",
          path: ["confirmPassword"],
        });
      } else if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Auth.validation.passwordsDoNotMatch",
          path: ["confirmPassword"],
        });
      }
    }

    if (data.otp !== undefined && data.otp !== "") {
      if (data.otp.length !== 5) {
        ctx.addIssue({
          code: "custom",
          message: "Auth.validation.otpLength",
          path: ["otp"],
        });
      }
    }
  });

export type ForgetPasswordFormValues = {
  email: string;
  newPassword?: string;
  confirmPassword?: string;
  otp?: string;
};

function ForgetPasswordForm({ setMode }: { setMode: (mode: AuthModeType) => void }) {
  const [step, setStep] = useState<"Email" | "Otp">("Email");
  const { t } = useLocale();
  const form = useForm<ForgetPasswordFormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      newPassword: "",
      confirmPassword: "",
      otp: "",
    },
    resolver: zodResolver(ForgetPasswordSchema),
  });
  const { timer, start, reset } = useTimer(120);

  return (
    <FormProvider {...form}>
      <div className="w-full p-6">
        <h5 className="text-h-5 text-white text-center mb-8">{t("Auth.title.forgetPassword")}</h5>
        {step === "Email" ? <ForgetEmailForm setMode={setMode} setStep={setStep} start={start} /> : <ForgetOtpForm setMode={setMode} setStep={setStep} start={start} reset={reset} timer={timer} />}
      </div>
    </FormProvider>
  );
}

export default ForgetPasswordForm;
