import { use, useState } from "react";
import { useLocale, useTimer } from "@/hooks";
import SignupOtpForm from "./otpForm/otpForm.index";
import SignupEmailForm from "./emailForm/emailForm.index";
import { AuthModalContext } from "../../../contexts/authModal";

function SignupForm() {
  const [step, setStep] = useState<"Email" | "Otp">("Email");
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
    username: string;
  }>({ email: "", password: "", username: "" });
  const { t } = useLocale();
  const { timer, start, reset } = useTimer(120);

  return (
    <div className="w-full p-6">
      <h5 className="text-h-5 text-white text-center mb-8">{t("Auth.title.signup")}</h5>
      {step === "Email" ? <SignupEmailForm setStep={setStep} start={start} defaultValues={credentials} onSubmit={(values) => setCredentials(values)} /> : <SignupOtpForm setStep={setStep} start={start} reset={reset} timer={timer} email={credentials.email} password={credentials.password} username={credentials.username} />}
    </div>
  );
}

export default SignupForm;
