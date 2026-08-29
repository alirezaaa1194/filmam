import { useState } from "react";
import { useLocale, useTimer } from "@/hooks";
import SignupOtpForm from "./otpForm/otpForm.index";
import SignupEmailForm from "./emailForm/emailForm.index";
import { AuthModeType } from "../../../types";

function SignupForm({ setMode }: { setMode: (mode: AuthModeType) => void }) {
  const [step, setStep] = useState<"Email" | "Otp">("Email");
  const [credentials, setCredentials] = useState<{
    email: string;
    password: string;
    username: string;
  } | null>(null);
  const { t } = useLocale();
  const { timer, start, reset } = useTimer(120);

  return (
    <div className="w-full p-6">
      <h5 className="text-h-5 text-white text-center mb-8">
        {t("Auth.title.signup")}
      </h5>
      {step === "Email" ? (
        <SignupEmailForm
          setMode={setMode}
          setStep={setStep}
          start={start}
          onSubmit={(values) => setCredentials(values)}
        />
      ) : (
        <SignupOtpForm
          setMode={setMode}
          setStep={setStep}
          start={start}
          reset={reset}
          timer={timer}
          email={credentials?.email ?? ""}
          password={credentials?.password ?? ""}
          username={credentials?.username ?? ""}
        />
      )}
    </div>
  );
}

export default SignupForm;
