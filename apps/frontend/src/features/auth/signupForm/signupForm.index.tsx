import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import { useTimer } from "@/hooks";
import SignupOtpForm from "./otpForm/otpForm.index";
import SignupEmailForm from "./emailForm/emailForm.index";
import { AuthModeType } from "../../../types";

export const SignupSchema = z
  .object({
    username: z.string().min(1, "لطفا نام کاربری را وارد کنید"),
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

export type SignupFormValues = {
  username: string;
  email: string;
  password: string;
  otp?: string;
};

function SignupForm({ setMode }: { setMode: (mode: AuthModeType) => void }) {
  const [step, setStep] = useState<"Email" | "Otp">("Email");
  const form = useForm<SignupFormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(SignupSchema),
  });
  const { timer, start, reset } = useTimer(120);

  return (
    <FormProvider {...form}>
      <div className="w-full p-6">
        <h5 className="text-h-5 text-white text-center mb-8">ثبت نام</h5>
        {step === "Email" ? <SignupEmailForm setMode={setMode} setStep={setStep} start={start} /> : <SignupOtpForm setMode={setMode} setStep={setStep} start={start} reset={reset} timer={timer} />}
      </div>
    </FormProvider>
  );
}

export default SignupForm;
