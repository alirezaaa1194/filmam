import { AuthModeType } from "@/types";
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

type SignupFormValues = {
  username: string;
  email: string;
  password: string;
  otp: string;
};
function SignupOtpForm({ setStep, start, reset, timer }: { setStep: (step: "Email" | "Otp") => void; setMode: (mode: AuthModeType) => void; start: () => void; reset: () => void; timer: number }) {
  const { locale } = useLocale();
  const { control, handleSubmit, getValues, setError } = useFormContext<SignupFormValues>();
  const email = getValues("email");
  const password = getValues("password");
  const username = getValues("username");

  const { mutate, isPending } = useMutation({
    mutationFn: (value: { email: string; password: string; username: string; otp: string }) => ClientCall(AppApis.auth.signupVerify, { method: "POST", body: { ...value, preferred_language: locale } }),
    onSuccess: () => {
      setStep("Otp");
      start();
      toast.success("کد تایید با موفقیت ارسال شد");
    },
    onError: (error: Response) => {
      toast.error(TranslateServerError(error.status));
    },
  });

  const { mutate: loginMutate, isPending: loginIsPending } = useMutation({
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

  const onSubmit = (data: SignupFormValues) => {
    if (!data.otp || data.otp.length !== 5) {
      setError("otp", {
        type: "manual",
        message: "کد تایید باید 5 رقمی باشد",
      });
      return;
    }
    mutate({ email, password, username, otp: data.otp || "" });
  };

  return (
    <form id="otp-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-start">
      <FieldGroup>
        <Controller
          name="otp"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="otp-form-otp" className="text-h-6">
                کد تایید
              </FieldLabel>
              <Input {...field} id="otp-form-otp" autoFocus type="text" inputMode="numeric" pattern="[0-9]*" maxLength={5} placeholder="-----" className={`h-12 border border-gray-10 text-white transition-all ring-0! text-center! tracking-[2rem] ${fieldState.invalid ? "border-error" : "focus:border-primary"} text-body-xxs text-left rounded-md`} dir="ltr" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-error! text-body-xxs" />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="button"
        className="w-full h-12 cursor-pointer mt-12 rounded-md bg-transparent! border border-gray-9 hover:text-gray-9"
        disabled={isPending || loginIsPending || timer > 0}
        onClick={() => {
          loginMutate({ email: getValues("email"), username: getValues("username"), password: getValues("password") });
        }}
      >
        {timer > 0 ? (
          <div className="flex items-center">
            ارسال مجدد کد تا
            <span className="block w-8">{timer}</span>
            ثانیه دیگر
          </div>
        ) : (
          <>{loginIsPending ? <Spinner /> : null} ارسال مجدد</>
        )}
      </Button>

      <Button type="submit" className="w-full h-12 cursor-pointer mt-4 rounded-md disabled:bg-gray-3 disabled:text-gray-7" disabled={isPending}>
        {isPending ? <Spinner /> : null} ثبت نام
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

export default SignupOtpForm;
