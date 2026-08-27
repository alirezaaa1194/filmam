import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import LoginEmailForm from "./emailForm/emailForm.index";
import { useState } from "react";
import LoginOtpForm from "./otpForm/otpForm.index";
import { useLocale, useTimer } from "@/hooks";
import { AuthModeType } from "../../../types";

export const LoginSchema = z
  .object({
    email: z.email("Auth.validation.emailInvalid"),
    password: z.string().min(8, "Auth.validation.passwordMinLength"),
    otp: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.otp && data.otp.length > 0 && data.otp.length !== 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Auth.validation.otpLength",
        path: ["otp"],
      });
    }
  });

export type LoginFormValues = {
  email: string;
  password: string;
  otp?: string;
};

function LoginForm({ setMode }: { setMode: (mode: AuthModeType) => void }) {
  const [step, setStep] = useState<"Email" | "Otp">("Email");
  const { t } = useLocale();
  const form = useForm<LoginFormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });
  const { timer, start, reset } = useTimer(120);

  return (
    <FormProvider {...form}>
      <div className="w-full p-6">
        <h5 className="text-h-5 text-white text-center mb-8">{t("Auth.title.login")}</h5>
        {step === "Email" ? <LoginEmailForm setMode={setMode} setStep={setStep} start={start} /> : <LoginOtpForm setMode={setMode} setStep={setStep} start={start} reset={reset} timer={timer} />}
      </div>
    </FormProvider>
  );
}

export default LoginForm;
