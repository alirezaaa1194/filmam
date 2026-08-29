import { useState } from "react";
import { useLocale, useTimer } from "@/hooks";
import ForgetEmailForm from "./emailForm/emailForm.index";
import ForgetOtpForm from "./otpForm/otpForm.index";
import { AuthModeType } from "../../../types";

function ForgetPasswordForm({
  setMode,
}: {
  setMode: (mode: AuthModeType) => void;
}) {
  const [step, setStep] = useState<"Email" | "Otp">("Email");
  const [email, setEmail] = useState<string>("");
  const { t } = useLocale();
  const { timer, start, reset } = useTimer(120);

  return (
    <div className="w-full p-6">
      <h5 className="text-h-5 text-white text-center mb-8">
        {t("Auth.title.forgetPassword")}
      </h5>
      {step === "Email" ? (
        <ForgetEmailForm
          setMode={setMode}
          setStep={setStep}
          start={start}
          defaultValues={{ email }}
          onSubmit={(value) => setEmail(value.email)}
        />
      ) : (
        <ForgetOtpForm
          setMode={setMode}
          setStep={setStep}
          start={start}
          reset={reset}
          timer={timer}
          email={email}
        />
      )}
    </div>
  );
}

export default ForgetPasswordForm;
