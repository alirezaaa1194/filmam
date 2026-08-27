import { Input } from "@/components/ui/input";
import { useGoogle, useLocale } from "@/hooks";
import { AuthModeEnum, AuthModeType } from "@/types";
import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { ClientCall } from "@/scripts/client";
import { AppApis } from "@/data";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { TranslateServerError } from "@/scripts";
import { SignupFormValues } from "../signupForm.index";
import googleIcon from "@/assets/icons/google.svg";
import Image from "next/image";

function SignupEmailForm({ setStep, setMode, start }: { setStep: (step: "Email" | "Otp") => void; setMode: (mode: AuthModeType) => void; start: () => void }) {
  const { dir, locale } = useLocale();
  const form = useFormContext<SignupFormValues>();

  const { mutate, isPending } = useMutation({
    mutationFn: (value: { email: string; password: string; username: string }) => ClientCall(AppApis.auth.signup, { method: "POST", body: { ...value, preferred_language: locale } }),
    onSuccess: () => {
      setStep("Otp");
      start();
      toast.success("کد تایید با موفقیت ارسال شد");
    },
    onError: (error: Response) => {
      toast.error(TranslateServerError(error.status));
    },
  });

  const { handleGoogleLogin, isGoogleLoading } = useGoogle();

  function onSubmit(data: SignupFormValues) {
    form.setValue("otp", "");
    mutate({ email: data.email, password: data.password, username: data.username });
  }

  return (
    <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-start">
      <FieldGroup>
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="signup-form-username" className="text-h-6">
                نام کاربری
              </FieldLabel>
              <Input {...field} id="signup-form-username" aria-invalid={fieldState.invalid} autoFocus placeholder="نام کاربری خود را وارد کنید" autoComplete="off" className={`h-12 px-4 border border-gray-10 text-white transition-all ring-0! ${fieldState.invalid ? "border-error" : "focus:border-primary"} text-body-xxs text-left ${dir === "rtl" ? "placeholder:text-right" : "placeholder:text-left"} rounded-lg`} dir="ltr" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-error! text-body-xxs" />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="signup-form-email" className="text-h-6">
                ایمیل
              </FieldLabel>
              <Input {...field} id="signup-form-email" aria-invalid={fieldState.invalid} placeholder="ایمیل خود را وارد کنید" autoComplete="off" className={`h-12 px-4 border border-gray-10 text-white transition-all ring-0! ${fieldState.invalid ? "border-error" : "focus:border-primary"} text-body-xxs text-left ${dir === "rtl" ? "placeholder:text-right" : "placeholder:text-left"} rounded-lg`} dir="ltr" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-error! text-body-xxs" />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="signup-form-password" className="text-h-6">
                رمز عبور
              </FieldLabel>
              <Input type="password" {...field} id="signup-form-password" aria-invalid={fieldState.invalid} placeholder="رمز عبور خود را وارد کنید" autoComplete="off" className={`h-12 px-4 border border-gray-10 text-white transition-all ring-0! ${fieldState.invalid ? "border-error" : "focus:border-primary"} text-body-xxs text-left ${dir === "rtl" ? "placeholder:text-right" : "placeholder:text-left"} rounded-lg`} dir="ltr" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-error! text-body-xxs" />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="w-full mt-12 flex items-center gap-2">
        <Button type="submit" className="flex-1 h-12 cursor-pointer rounded-md disabled:bg-gray-3 disabled:text-gray-7" disabled={isPending || isGoogleLoading}>
          {isPending ? <Spinner /> : null} ارسال کد تایید
        </Button>
        <Button type="button" className="shrink-0 min-w-12 h-12 cursor-pointer rounded-md bg-white hover:bg-gray-6" disabled={isPending || isGoogleLoading} onClick={handleGoogleLogin}>
          {isGoogleLoading ? <Spinner /> : null} <Image src={googleIcon} alt="google-oauth" width={24} height={24} className="size-6" />
        </Button>
      </div>

      <button
        className="cursor-pointer mt-4 self-center text-body-xxs transition-all text-warning hover:text-warning/80"
        onClick={() => {
          setMode(AuthModeEnum.LOGIN);
        }}
      >
        حساب دارید؟ وارد شوید
      </button>
    </form>
  );
}

export default SignupEmailForm;
