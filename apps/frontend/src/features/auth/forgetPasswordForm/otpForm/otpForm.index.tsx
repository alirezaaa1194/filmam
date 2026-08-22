import { AuthModeType } from "../../auth.index";
import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { ClientCall } from "@/scripts/client";
import { AppApis } from "@/data";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { TranslateServerError } from "@/scripts";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/hooks";
import { ForgetPasswordSchema } from "../forgetPasswordForm.index";
import z from "zod";

export type ForgetPasswordFormValues = z.infer<typeof ForgetPasswordSchema>;

function ForgetOtpForm({ setStep, setMode, start, reset, timer }: { setStep: (step: "Email" | "Otp") => void; setMode: (mode: AuthModeType) => void; start: () => void; reset: () => void; timer: number }) {
  const { dir } = useLocale();
  const { control, handleSubmit, getValues, setError, setValue } = useFormContext<ForgetPasswordFormValues>();

  const { mutate, isPending } = useMutation({
    mutationFn: (value: { email: string; newPassword: string; otp: string }) => ClientCall(AppApis.auth.resetPassword, { method: "PUT", body: { email: value.email, new_password: value.newPassword, otp: value.otp } }),
    onSuccess: () => {
      setStep("Otp");
      start();
      toast.success("کد تایید با موفقیت ارسال شد");
    },
    onError: (error: Response) => {
      toast.error(TranslateServerError(error.status));
    },
  });

  const { mutate: forgetMutate, isPending: forgetIsPending } = useMutation({
    mutationFn: (value: { email: string }) => ClientCall(AppApis.auth.forgetPassword, { method: "POST", body: value }),
    onSuccess: () => {
      start();
      setValue("otp", "");
      setMode("Login");
      toast.success("رمز عبور با موفقیت تغییر کرد");
    },
    onError: (error: Response) => {
      toast.error(TranslateServerError(error.status));
    },
  });

  const onSubmit = (data: ForgetPasswordFormValues) => {
    let isValid = true;

    if (!data.newPassword) {
      setError("newPassword", {
        type: "manual",
        message: "لطفا رمز عبور را وارد کنید",
      });
      isValid = false;
    } else if (data.newPassword.length < 8) {
      setError("newPassword", {
        type: "manual",
        message: "رمز عبور حداقل 8 کاراکتر",
      });
      isValid = false;
    }

    if (!data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "لطفا تکرار رمز عبور را وارد کنید",
      });
      isValid = false;
    } else if (data.newPassword !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "رمزهای عبور یکسان نیستند",
      });
      isValid = false;
    }

    if (!data.otp) {
      setError("otp", {
        type: "manual",
        message: "لطفا کد تایید را وارد کنید",
      });
      isValid = false;
    } else if (data.otp.length !== 5) {
      setError("otp", {
        type: "manual",
        message: "کد تایید باید 5 رقمی باشد",
      });
      isValid = false;
    }

    if (isValid) {
      mutate({
        email: data.email,
        newPassword: data.newPassword!,
        otp: data.otp!,
      });
    }
  };
  return (
    <form id="otp-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-start">
      <FieldGroup>
        <Controller
          name="newPassword"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-form-password" className="text-h-6">
                رمز عبور
              </FieldLabel>
              <Input type="password" {...field} id="login-form-password" aria-invalid={fieldState.invalid} placeholder="رمز عبور خود را وارد کنید" autoComplete="off" className={`h-12 border border-gray-10 text-white transition-all ring-0! ${fieldState.invalid ? "border-error" : "focus:border-primary"} text-body-xxs text-left ${dir === "rtl" ? "placeholder:text-right" : "placeholder:text-left"} rounded-md`} dir="ltr" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-error! text-body-xxs" />}
            </Field>
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="login-form-password" className="text-h-6">
                تکرار رمز عبور
              </FieldLabel>
              <Input type="password" {...field} id="login-form-password" aria-invalid={fieldState.invalid} placeholder="رمز عبور خود را وارد کنید" autoComplete="off" className={`h-12 border border-gray-10 text-white transition-all ring-0! ${fieldState.invalid ? "border-error" : "focus:border-primary"} text-body-xxs text-left ${dir === "rtl" ? "placeholder:text-right" : "placeholder:text-left"} rounded-md`} dir="ltr" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-error! text-body-xxs" />}
            </Field>
          )}
        />
        <Controller
          name="otp"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="otp-form-otp" className="text-h-6">
                کد تایید
              </FieldLabel>
              <Input {...field} id="otp-form-otp" autoFocus type="text" inputMode="numeric" pattern="[0-9]*" maxLength={5} placeholder="-----" className={`h-12 border border-gray-10 text-white transition-all ring-0! text-center! tracking-[2rem] ${fieldState.invalid ? "border-error" : "focus:border-primary"} text-body-xxs text-left rounded-lg`} dir="ltr" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-error! text-body-xxs" />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="button"
        className="w-full h-12 cursor-pointer mt-12 rounded-md bg-transparent! border border-gray-9 hover:text-gray-9"
        disabled={isPending || forgetIsPending || timer > 0}
        onClick={() => {
          forgetMutate({ email: getValues("email") });
        }}
      >
        {timer > 0 ? (
          <div className="flex items-center">
            ارسال مجدد کد تا
            <span className="block w-8">{timer}</span>
            ثانیه دیگر
          </div>
        ) : (
          <>{forgetIsPending ? <Spinner /> : null} ارسال مجدد</>
        )}
      </Button>

      <Button type="submit" className="w-full h-12 cursor-pointer mt-4 rounded-md disabled:bg-gray-3 disabled:text-gray-7" disabled={isPending}>
        {isPending ? <Spinner /> : null} ورود
      </Button>

      <button
        className="cursor-pointer mt-4 self-center text-body-xxs transition-all text-warning hover:text-warning/80"
        onClick={() => {
          reset();
          setStep("Email");
        }}
      >
        ایمیل را اشتباه وارد کرده اید؟
      </button>
    </form>
  );
}

export default ForgetOtpForm;
