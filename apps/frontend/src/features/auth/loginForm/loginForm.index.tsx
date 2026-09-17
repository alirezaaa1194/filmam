import { useState } from "react";
import LoginEmailForm from "./emailForm/emailForm.index";
import LoginOtpForm from "./otpForm/otpForm.index";
import { useLocale, useTimer } from "@/hooks";

function LoginForm() {
  const [step, setStep] = useState<"Email" | "Otp">("Email");
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  }>({ email: "", password: "" });
  const { t } = useLocale();
  const { timer, start, reset } = useTimer(120);

  return (
    <div className="w-full p-6">
      <h5 className="text-h-5 text-white text-center mb-8">{t("Auth.title.login")}</h5>
      {step === "Email" ? <LoginEmailForm setStep={setStep} start={start} defaultValues={credentials} onSubmit={(values) => setCredentials(values)} /> : <LoginOtpForm setStep={setStep} start={start} reset={reset} timer={timer} email={credentials.email} password={credentials.password} />}
    </div>
  );
}

export default LoginForm;
