import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import LoginEmailForm from "./emailForm/emailForm.index";
import { useState } from "react";
import LoginOtpForm from "./otpForm/otpForm.index";
import { useTimer } from "@/hooks";
import { AuthModeType } from "../../../types";

export const LoginSchema = z
  .object({
    email: z.email("ایمیل معتبر وارد کنید"),
    password: z.string().min(8, "رمز عبور حداقل 8 کاراکتر"),
    otp: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.otp && data.otp.length > 0 && data.otp.length !== 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "کد تایید باید 5 رقمی باشد",
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
        <h5 className="text-h-5 text-white text-center mb-8">ورود</h5>
        {step === "Email" ? <LoginEmailForm setMode={setMode} setStep={setStep} start={start} /> : <LoginOtpForm setMode={setMode} setStep={setStep} start={start} reset={reset} timer={timer} />}
      </div>
    </FormProvider>
  );
}

export default LoginForm;
