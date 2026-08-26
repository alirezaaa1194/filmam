import { Input } from "@/components/ui/input";
import { useLocale } from "@/hooks";
import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { ClientCall } from "@/scripts/client";
import { AppApis } from "@/data";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { TranslateServerError } from "@/scripts";
import { LoginFormValues } from "../loginForm.index";
import { AuthModeEnum, AuthModeType } from "../../../../types";
import googleIcon from "@/assets/icons/google.svg";
import Image from "next/image";

function LoginEmailForm({ setStep, setMode, start }: { setStep: (step: "Email" | "Otp") => void; setMode: (mode: AuthModeType) => void; start: () => void }) {
  const { dir } = useLocale();
  const form = useFormContext<LoginFormValues>();

  const { mutate, isPending } = useMutation({
    mutationFn: (value: { email: string; password: string }) => ClientCall(AppApis.auth.login, { method: "POST", body: value }),
    onSuccess: () => {
      setStep("Otp");
      start();
      toast.success("کد تایید با موفقیت ارسال شد");
    },
    onError: (error: Response) => {
      toast.error(TranslateServerError(error.status));
    },
  });

  function onSubmit(data: LoginFormValues) {
    form.setValue("otp", "");
    mutate({ email: data.email, password: data.password });
  }

  return (
    <form id="login-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-start">
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-form-email" className="text-h-6">
                ایمیل
              </FieldLabel>
              <Input {...field} id="login-form-email" aria-invalid={fieldState.invalid} autoFocus placeholder="ایمیل خود را وارد کنید" autoComplete="off" className={`h-12 border border-gray-10 text-white transition-all ring-0! ${fieldState.invalid ? "border-error" : "focus:border-primary"} text-body-xxs text-left ${dir === "rtl" ? "placeholder:text-right" : "placeholder:text-left"} rounded-lg`} dir="ltr" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-error! text-body-xxs" />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-form-password" className="text-h-6">
                رمز عبور
              </FieldLabel>
              <Input type="password" {...field} id="login-form-password" aria-invalid={fieldState.invalid} placeholder="رمز عبور خود را وارد کنید" autoComplete="off" className={`h-12 border border-gray-10 text-white transition-all ring-0! ${fieldState.invalid ? "border-error" : "focus:border-primary"} text-body-xxs text-left ${dir === "rtl" ? "placeholder:text-right" : "placeholder:text-left"} rounded-lg`} dir="ltr" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-error! text-body-xxs" />}
            </Field>
          )}
        />
      </FieldGroup>
      <button
        type="button"
        className="cursor-pointer mt-2 text-body-xxs transition-all text-warning hover:text-warning/80"
        onClick={() => {
          setMode(AuthModeEnum.FORGET_PASSWORD);
        }}
      >
        رمز عبور خود را فراموش کرده اید؟
      </button>

      <div className="w-full mt-12 flex items-center gap-2">
        <Button type="submit" className="flex-1 h-12 cursor-pointer rounded-md disabled:bg-gray-3 disabled:text-gray-7" disabled={isPending}>
          {isPending ? <Spinner /> : null} ارسال کد تایید
        </Button>
        <Button className="shrink-0 w-12 h-12 cursor-pointer rounded-md bg-white hover:bg-gray-6" disabled={isPending}>
          <Image src={googleIcon} alt="google-oauth" width={24} height={24} className="size-6" />
        </Button>
      </div>

      <button
        className="cursor-pointer mt-4 self-center text-body-xxs transition-all text-warning hover:text-warning/80"
        onClick={() => {
          setMode(AuthModeEnum.SIGNUP);
        }}
      >
        حساب ندارید؟ ثبت نام کنید
      </button>
    </form>
  );
}

export default LoginEmailForm;
