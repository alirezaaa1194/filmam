import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/utilities/components/ui/input/input.index";
import { PasswordInput } from "@/utilities/components/ui/passwordInput/passwordInput.index";
import { useGoogle, useIsMobile, useLocale } from "@/hooks";
import { AuthModeEnum, AuthModeType } from "@/types";
import { Controller } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/utilities/components/ui/field/field.index";
import { Button } from "@/utilities/components/ui/button/button.index";
import { useMutation } from "@tanstack/react-query";
import { ClientCall } from "@/scripts/client";
import { AppApis } from "@/data";
import { Spinner } from "@/utilities/components/ui/spinner/spinner.index";
import { toast } from "sonner";
import { TranslateServerError } from "@/scripts";
import googleIcon from "@/assets/icons/google.svg";
import Image from "next/image";

export const SignupEmailSchema = z.object({
  username: z.string().min(1, "Auth.validation.usernameRequired"),
  email: z.email("Auth.validation.emailInvalid"),
  password: z.string().min(8, "Auth.validation.passwordMinLength"),
});

export type SignupEmailFormValues = {
  username: string;
  email: string;
  password: string;
};

function SignupEmailForm({ setStep, setMode, start, onSubmit, defaultValues }: { setStep: (step: "Email" | "Otp") => void; setMode: (mode: AuthModeType) => void; start: () => void; onSubmit: (values: SignupEmailFormValues) => void; defaultValues: SignupEmailFormValues }) {
  const { locale, t, dir } = useLocale();
  const form = useForm<SignupEmailFormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      username: defaultValues.username,
      email: defaultValues.email,
      password: defaultValues.password,
    },
    resolver: zodResolver(SignupEmailSchema),
  });
  const isMobile = useIsMobile();

  const { mutate, isPending } = useMutation({
    mutationFn: (value: { email: string; password: string; username: string }) =>
      ClientCall(AppApis.auth.signup, {
        method: "POST",
        body: { ...value, preferred_language: locale },
      }),
    onSuccess: () => {
      setStep("Otp");
      start();
      toast.success(t("Auth.toasts.otpSent"));
    },
    onError: (error: Response) => {
      toast.error(t(TranslateServerError(error.status)));
    },
  });

  const { handleGoogleLogin, isGoogleLoading } = useGoogle();

  function handleSubmit(data: SignupEmailFormValues) {
    onSubmit(data);
    mutate({
      email: data.email,
      password: data.password,
      username: data.username,
    });
  }

  return (
    <form id="signup-form" onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col items-start w-full">
      <FieldGroup>
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="w-full">
              <FieldLabel htmlFor="signup-form-username" className="text-h-6 max-md:text-mobile-h-6">
                {t("Auth.fields.username")}
              </FieldLabel>
              <Input {...field} id="signup-form-username" aria-invalid={fieldState.invalid} autoFocus={!isMobile} placeholder={t("Auth.placeholders.username")} autoComplete="off" className={`text-body-xxs ${dir === "rtl" ? "[&::placeholder]:text-right" : "[&::placeholder]:text-left"}`} dir="ltr" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-error! text-body-xxs" />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="w-full">
              <FieldLabel htmlFor="signup-form-email" className="text-h-6 max-md:text-mobile-h-6">
                {t("Auth.fields.email")}
              </FieldLabel>
              <Input {...field} id="signup-form-email" aria-invalid={fieldState.invalid} placeholder={t("Auth.placeholders.email")} autoComplete="off" className={`text-body-xxs ${dir === "rtl" ? "[&::placeholder]:text-right" : "[&::placeholder]:text-left"}`} dir="ltr" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-error! text-body-xxs" />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="w-full">
              <FieldLabel htmlFor="signup-form-password" className="text-h-6 max-md:text-mobile-h-6">
                {t("Auth.fields.password")}
              </FieldLabel>
              <PasswordInput {...field} id="signup-form-password" aria-invalid={fieldState.invalid} placeholder={t("Auth.placeholders.password")} autoComplete="off" className={`text-body-xxs ${dir === "rtl" ? "[&_input::placeholder]:text-right" : "[&_input::placeholder]:text-left"}`} dir="ltr" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-error! text-body-xxs" />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="w-full mt-12 flex items-stretch gap-2">
        <Button type="submit" className="flex-1 min-w-0 transition-[flex-grow,opacity] duration-300 ease-in-out h-12 cursor-pointer rounded-md disabled:bg-gray-3 disabled:text-gray-7" disabled={isPending || isGoogleLoading}>
          <span className="inline-flex items-center justify-center gap-2 truncate">
            {isPending ? <Spinner /> : null}
            <span>{t("Auth.buttons.sendCode")}</span>
          </span>
        </Button>
        <Button type="button" className="w-12 shrink-0 transition-[width,background-color,opacity] duration-300 ease-in-out h-12 cursor-pointer rounded-md bg-white text-gray-13 hover:bg-gray-6 disabled:opacity-50 disabled:bg-gray-3" disabled={isPending || isGoogleLoading} onClick={handleGoogleLogin} aria-label="Continue with Google">
          {isGoogleLoading ? <Spinner /> : <Image src={googleIcon} alt="google-oauth" width={24} height={24} className="size-6" />}
        </Button>
      </div>

      <button
        className="cursor-pointer mt-4 self-center text-body-xxs transition-all text-warning hover:text-warning/80"
        onClick={() => {
          setMode(AuthModeEnum.LOGIN);
        }}
      >
        {t("Auth.links.haveAccount")}
      </button>
    </form>
  );
}

export default SignupEmailForm;
