import { Input } from "@/utilities/components/ui/input/input.index";
import { useLocale } from "@/hooks";
import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/utilities/components/ui/field/field.index";
import { Button } from "@/utilities/components/ui/button/button.index";
import { useMutation } from "@tanstack/react-query";
import { ClientCall } from "@/scripts/client";
import { AppApis } from "@/data";
import { Spinner } from "@/utilities/components/ui/spinner/spinner.index";
import { toast } from "sonner";
import { TranslateServerError } from "@/scripts";
import { ForgetPasswordFormValues } from "../forgetPasswordForm.index";
import { AuthModeEnum, AuthModeType } from "../../../../types";

function ForgetEmailForm({ setStep, setMode, start }: { setStep: (step: "Email" | "Otp") => void; setMode: (mode: AuthModeType) => void; start: () => void }) {
  const { t, dir } = useLocale();
  const form = useFormContext<ForgetPasswordFormValues>();

  const { mutate, isPending } = useMutation({
    mutationFn: (value: { email: string }) => ClientCall(AppApis.auth.forgetPassword, { method: "POST", body: value }),
    onSuccess: () => {
      setStep("Otp");
      start();
      toast.success(t("Auth.toasts.otpSent"));
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
    <form id="forget-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-start w-full">
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="w-full">
              <FieldLabel htmlFor="forget-form-email" className="text-h-6 max-md:text-mobile-h-6">
                {t("Auth.fields.email")}
              </FieldLabel>
              <Input {...field} id="forget-form-email" aria-invalid={fieldState.invalid} autoFocus placeholder={t("Auth.placeholders.email")} autoComplete="off" className={`text-body-xxs ${dir === "rtl" ? "[&::placeholder]:text-right" : "[&::placeholder]:text-left"}`} dir="ltr" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-error! text-body-xxs" />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" className="w-full h-12 cursor-pointer mt-12 rounded-md disabled:bg-gray-3 disabled:text-gray-7" disabled={isPending}>
        {isPending ? <Spinner /> : null} {t("Auth.buttons.sendCode")}
      </Button>

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

export default ForgetEmailForm;
