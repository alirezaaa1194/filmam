import { Input } from "@/components/ui/input";
import { useLocale } from "@/hooks";
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
import { ForgetPasswordFormValues } from "../forgetPasswordForm.index";

function ForgetEmailForm({ setStep, setMode, start }: { setStep: (step: "Email" | "Otp") => void; setMode: (mode: AuthModeType) => void; start: () => void }) {
  const { dir } = useLocale();
  const form = useFormContext<ForgetPasswordFormValues>();

  const { mutate, isPending } = useMutation({
    mutationFn: (value: { email: string }) => ClientCall(AppApis.auth.forgetPassword, { method: "POST", body: value }),
    onSuccess: () => {
      setStep("Otp");
      start();
      toast.success("کد تایید با موفقیت ارسال شد");
    },
    onError: (error: Response) => {
      toast.error(TranslateServerError(error.status));
    },
  });

  function onSubmit(data: ForgetPasswordFormValues) {
    form.setValue("otp", "");
    mutate({ email: data.email });
  }

  return (
    <form id="forget-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-start">
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="forget-form-email" className="text-h-6">
                ایمیل
              </FieldLabel>
              <Input {...field} id="forget-form-email" aria-invalid={fieldState.invalid} autoFocus placeholder="ایمیل خود را وارد کنید" autoComplete="off" className={`h-12 border border-gray-10 text-white transition-all ring-0! ${fieldState.invalid ? "border-error" : "focus:border-primary"} text-body-xxs text-left ${dir === "rtl" ? "placeholder:text-right" : "placeholder:text-left"} rounded-lg`} dir="ltr" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-error! text-body-xxs" />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" className="w-full h-12 cursor-pointer mt-12 rounded-md disabled:bg-gray-3 disabled:text-gray-7" disabled={isPending}>
        {isPending ? <Spinner /> : null} ارسال کد تایید
      </Button>

      <button
        className="cursor-pointer mt-4 self-center text-body-xxs transition-all text-warning hover:text-warning/80"
        onClick={() => {
          setMode("Login");
        }}
      >
        میخواهید وارد شوید؟
      </button>
    </form>
  );
}

export default ForgetEmailForm;
