import { useState } from "react";
import LoginEmailForm from "./emailForm/emailForm.index";
import LoginOtpForm from "./otpForm/otpForm.index";
import { useLocale, useTimer } from "@/hooks";
import { AuthModeType } from "../../../types";

function LoginForm({ setMode }: { setMode: (mode: AuthModeType) => void }) {
  const [step, setStep] = useState<"Email" | "Otp">("Email");
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);
  const { t } = useLocale();
  const { timer, start, reset } = useTimer(120);

  return (
    <div className="w-full p-6">
      <h5 className="text-h-5 text-white text-center mb-8">
        {t("Auth.title.login")}
      </h5>
      {step === "Email" ? (
        <LoginEmailForm
          setMode={setMode}
          setStep={setStep}
          start={start}
          onSubmit={(values) => setCredentials(values)}
        />
      ) : (
        <LoginOtpForm
          setMode={setMode}
          setStep={setStep}
          start={start}
          reset={reset}
          timer={timer}
          email={credentials?.email ?? ""}
          password={credentials?.password ?? ""}
        />
      )}
    </div>
  );
}

export default LoginForm;
