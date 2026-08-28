import { AuthModeType } from "@/types";
import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/utilities/components/ui/field/field.index";
import { Button } from "@/utilities/components/ui/button/button.index";
import { useMutation } from "@tanstack/react-query";
import { ClientCall } from "@/scripts/client";
import { AppApis } from "@/data";
import { Spinner } from "@/utilities/components/ui/spinner/spinner.index";
import { toast } from "sonner";
import { TranslateServerError } from "@/scripts";
import { Input } from "@/utilities/components/ui/input/input.index";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks";

type LoginFormValues = {
  email: string;
  password: string;
  otp: string;
};
function LoginOtpForm({ setStep, setMode, start, reset, timer }: { setStep: (step: "Email" | "Otp") => void; setMode: (mode: AuthModeType) => void; start: () => void; reset: () => void; timer: number }) {
  const { control, handleSubmit, getValues, setError, clearErrors } = useFormContext<LoginFormValues>();
  const { t } = useLocale();
  const email = getValues("email");
  const password = getValues("password");
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (value: { email: string; password: string; otp: string }) => ClientCall(AppApis.auth.loginVerify, { method: "POST", body: value }),
    onSuccess: () => {
      toast.success(t("Auth.toasts.loginSuccess"));
      setMode(null);
      router.refresh();
    },
    onError: (error: Response) => {
      toast.error(TranslateServerError(error.status));
    },
  });

  const { mutate: loginMutate, isPending: loginIsPending } = useMutation({
    mutationFn: (value: { email: string; password: string }) => ClientCall(AppApis.auth.login, { method: "POST", body: value }),
    onSuccess: () => {
      setStep("Otp");
      start();
      toast.success(t("Auth.toasts.otpSent"));
    },
    onError: (error: Response) => {
      toast.error(TranslateServerError(error.status));
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    if (!data.otp || data.otp.length !== 5) {
      setError("otp", {
        type: "manual",
        message: t("Auth.validation.otpLength"),
      });
      return;
    }
    mutate({ email, password, otp: data.otp || "" });
  };

  return (
    <form id="otp-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-start">
      <FieldGroup>
        <Controller
          name="otp"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="w-full">
              <FieldLabel htmlFor="otp-form-otp" className="text-h-6 max-md:text-mobile-h-6">
                {t("Auth.fields.otp")}
              </FieldLabel>
              <Input
                {...field}
                id="otp-form-otp"
                autoFocus
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={5}
                placeholder={t("Auth.placeholders.otp")}
                className="text-body-xxs text-center! tracking-[2rem] ps-8"
                dir="ltr"
                onChange={(event) => {
                  field.onChange(event);
                  if (fieldState.error) {
                    clearErrors("otp");
                  }
                }}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-error! text-body-xxs" />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="button"
        className="w-full h-12 cursor-pointer mt-12 rounded-lg bg-transparent! border border-gray-9 hover:text-gray-9"
        disabled={isPending || loginIsPending || timer > 0}
        onClick={() => {
          loginMutate({ email: getValues("email"), password: getValues("password") });
        }}
      >
        {timer > 0 ? (
          <div className="flex items-center">
            {t("Auth.buttons.resendIn")}
            <span className="block w-8">{timer}</span>
            {t("Auth.buttons.seconds")}
          </div>
        ) : (
          <>
            {loginIsPending ? <Spinner /> : null} {t("Auth.buttons.resend")}
          </>
        )}
      </Button>

      <Button type="submit" className="w-full h-12 cursor-pointer mt-4 rounded-md disabled:bg-gray-3 disabled:text-gray-7" disabled={isPending}>
        {isPending ? <Spinner /> : null} {t("Auth.buttons.login")}
      </Button>

      <button
        className="cursor-pointer mt-4 self-center text-body-xxs transition-all text-warning hover:text-warning/80"
        onClick={() => {
          reset();
          setStep("Email");
        }}
      >
        {t("Auth.links.wrongEmail")}
      </button>
    </form>
  );
}

export default LoginOtpForm;
