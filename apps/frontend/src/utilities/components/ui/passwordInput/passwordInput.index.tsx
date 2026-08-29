"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/utilities/components/ui/button/button.index";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  ref?: React.Ref<HTMLInputElement>;
};

export function PasswordInput({
  className,
  disabled,
  ref,
  value,
  defaultValue,
  onChange,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<string>(() => {
    if (value !== undefined) return String(value);
    if (defaultValue !== undefined) return String(defaultValue);
    return "";
  });

  const isControlled = value !== undefined;
  const currentValue = isControlled ? String(value) : internalValue;
  const hasValue = currentValue.length > 0;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!isControlled) {
      setInternalValue(event.target.value);
    }
    onChange?.(event);
  }

  return (
    <div className={cn("relative rounded-xl", className)}>
      <input
        type={showPassword ? "text" : "password"}
        data-slot="input"
        className="h-12 w-full min-w-0 rounded-xl border border-gray-12 bg-black px-4 py-1 text-base text-white transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-10 hover:border-gray-11 hover:bg-gray-12 focus:border-primary focus:bg-black focus:shadow-[0px_0px_0px_4px_rgba(0,146,93,0.2)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-black disabled:opacity-50 aria-invalid:border-error aria-invalid:shadow-[0px_0px_0px_4px_rgba(195,0,0,0.2)] md:text-sm"
        ref={ref}
        disabled={disabled}
        value={isControlled ? value : internalValue}
        onChange={handleChange}
        {...props}
      />
      {hasValue ? (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          tabIndex={-1}
          disabled={disabled}
          className="absolute right-3 cursor-pointer top-1/2 h-7 w-7 -translate-y-1/2 rounded-md text-gray-10 transition-all hover:text-white hover:bg-gray-12 [&_svg]:!size-[18px]"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <Eye /> : <EyeOff />}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </Button>
      ) : null}
    </div>
  );
}
