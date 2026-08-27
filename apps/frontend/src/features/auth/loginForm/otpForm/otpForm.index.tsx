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
import { useRouter } from "next/navigation";

type LoginFormValues = {
  email: string;
  password: string;
  otp: string;
};
function LoginOtpForm({ setStep, setMode, start, reset, timer }: { setStep: (step: "Email" | "Otp") => void; setMode: (mode: AuthModeType) => void; start: () => void; reset: () => void; timer: number }) {
  const { control, handleSubmit, getValues, setError } = useFormContext<LoginFormValues>();
  const email = getValues("email");
  const password = getValues("password");
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (value: { email: string; password: string; otp: string }) => ClientCall(AppApis.auth.loginVerify, { method: "POST", body: value }),
    onSuccess: () => {
      toast.success("ورود با موفقیت انجام شد");
      setMode(null)
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
      toast.success("کد تایید با موفقیت ارسال شد");
    },
    onError: (error: Response) => {
      toast.error(TranslateServerError(error.status));
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    if (!data.otp || data.otp.length !== 5) {
      setError("otp", {
        type: "manual",
        message: "کد تایید باید 5 رقمی باشد",
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
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="otp-form-otp" className="text-h-6">
                کد تایید
              </FieldLabel>
              <Input {...field} id="otp-form-otp" autoFocus type="text" inputMode="numeric" pattern="[0-9]*" maxLength={5} placeholder="-----" className={`h-12 border border-gray-10 text-white transition-all ring-0! text-center! tracking-[2rem] ps-8 ${fieldState.invalid ? "border-error" : "focus:border-primary"} text-body-xxs text-left rounded-lg`} dir="ltr" />
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
            ارسال مجدد کد تا
            <span className="block w-8">{timer}</span>
            ثانیه دیگر
          </div>
        ) : (
          <>{loginIsPending ? <Spinner /> : null} ارسال مجدد</>
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

export default LoginOtpForm;
