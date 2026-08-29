import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthModeEnum, AuthModeType } from "@/types";
import { Controller } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/utilities/components/ui/field/field.index";
import { Button } from "@/utilities/components/ui/button/button.index";
import { useMutation } from "@tanstack/react-query";
import { ClientCall } from "@/scripts/client";
import { AppApis } from "@/data";
import { Spinner } from "@/utilities/components/ui/spinner/spinner.index";
import { toast } from "sonner";
import { TranslateServerError } from "@/scripts";
import { Input } from "@/utilities/components/ui/input/input.index";
import { PasswordInput } from "@/utilities/components/ui/passwordInput/passwordInput.index";
import { useLocale } from "@/hooks";

const ForgetOtpSchema = z
  .object({
    newPassword: z.string().min(8, "Auth.validation.passwordMinLength"),
    confirmPassword: z.string(),
    otp: z.string().length(5, "Auth.validation.otpLength"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Auth.validation.passwordsDoNotMatch",
    path: ["confirmPassword"],
  });

type ForgetOtpFormValues = {
  newPassword: string;
  confirmPassword: string;
  otp: string;
};

function ForgetOtpForm({
  setStep,
  setMode,
  start,
  reset,
  timer,
  email,
}: {
  setStep: (step: "Email" | "Otp") => void;
  setMode: (mode: AuthModeType) => void;
  start: () => void;
  reset: () => void;
  timer: number;
  email: string;
}) {
  const { t, dir } = useLocale();
  const form = useForm<ForgetOtpFormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      otp: "",
    },
    resolver: zodResolver(ForgetOtpSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (value: { email: string; newPassword: string; otp: string }) =>
      ClientCall(AppApis.auth.resetPassword, {
        method: "PUT",
        body: {
          email: value.email,
          new_password: value.newPassword,
          otp: value.otp,
        },
      }),
    onSuccess: () => {
      setStep("Otp");
      start();
      toast.success(t("Auth.toasts.otpSent"));
    },
    onError: (error: Response) => {
      toast.error(TranslateServerError(error.status));
    },
  });

  const { mutate: forgetMutate, isPending: forgetIsPending } = useMutation({
    mutationFn: (value: { email: string }) =>
      ClientCall(AppApis.auth.forgetPassword, { method: "POST", body: value }),
    onSuccess: () => {
      start();
      form.reset();
      setMode(AuthModeEnum.LOGIN);
      toast.success(t("Auth.toasts.passwordChanged"));
    },
    onError: (error: Response) => {
      toast.error(TranslateServerError(error.status));
    },
  });

  const onSubmit = (data: ForgetOtpFormValues) => {
    mutate({
      email,
      newPassword: data.newPassword,
      otp: data.otp,
    });
  };

  return (
    <form
      id="otp-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col items-start w-full"
    >
      <FieldGroup>
        <Controller
          name="newPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="w-full">
              <FieldLabel
                htmlFor="login-form-password"
                className="text-h-6 max-md:text-mobile-h-6"
              >
                {t("Auth.fields.password")}
              </FieldLabel>
              <PasswordInput
                {...field}
                id="login-form-password"
                aria-invalid={fieldState.invalid}
                placeholder={t("Auth.placeholders.password")}
                autoComplete="off"
                className={`text-body-xxs ${dir === "rtl" ? "[&_input::placeholder]:text-right" : "[&_input::placeholder]:text-left"}`}
                dir="ltr"
              />
              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className="text-error! text-body-xxs"
                />
              )}
            </Field>
          )}
        />
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="w-full">
              <FieldLabel
                htmlFor="login-form-confirmPassword"
                className="text-h-6 max-md:text-mobile-h-6"
              >
                {t("Auth.fields.confirmPassword")}
              </FieldLabel>
              <PasswordInput
                {...field}
                id="login-form-confirmPassword"
                aria-invalid={fieldState.invalid}
                placeholder={t("Auth.placeholders.confirmPassword")}
                autoComplete="off"
                className={`text-body-xxs ${dir === "rtl" ? "[&_input::placeholder]:text-right" : "[&_input::placeholder]:text-left"}`}
                dir="ltr"
              />
              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className="text-error! text-body-xxs"
                />
              )}
            </Field>
          )}
        />
        <Controller
          name="otp"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="w-full">
              <FieldLabel
                htmlFor="otp-form-otp"
                className="text-h-6 max-md:text-mobile-h-6"
              >
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
              />
              {fieldState.invalid && (
                <FieldError
                  errors={[fieldState.error]}
                  className="text-error! text-body-xxs"
                />
              )}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="button"
        className="w-full h-12 cursor-pointer mt-12 rounded-lg bg-transparent! border border-gray-9 hover:text-gray-9"
        disabled={isPending || forgetIsPending || timer > 0}
        onClick={() => {
          forgetMutate({ email });
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
            {forgetIsPending ? <Spinner /> : null} {t("Auth.buttons.resend")}
          </>
        )}
      </Button>

      <Button
        type="submit"
        className="w-full h-12 cursor-pointer mt-4 rounded-md disabled:bg-gray-3 disabled:text-gray-7"
        disabled={isPending}
      >
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

export default ForgetOtpForm;
