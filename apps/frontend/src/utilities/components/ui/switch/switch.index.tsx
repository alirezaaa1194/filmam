"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const switchVariants = cva("peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", {
  variants: {
    size: {
      sm: "h-4 w-8",
      default: "h-6 w-11",
      lg: "h-7 w-14",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const thumbVariants = cva("pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform", {
  variants: {
    size: {
      sm: "size-3",
      default: "size-5",
      lg: "size-6",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const translateMap = {
  sm: "translate-x-4",
  default: "translate-x-5",
  lg: "translate-x-7",
} as const;

interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange">, VariantProps<typeof switchVariants> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(({ className, checked, onCheckedChange, size = "default", ...props }, ref) => (
  <button
    type="button"
    role="switch"
    aria-checked={!!checked}
    ref={ref}
    onClick={() => {
      onCheckedChange?.(!checked);
    }}
    className={cn(switchVariants({ size }), checked ? "bg-primary" : "bg-gray-7", className)}
    {...props}
  >
    <span className={cn(thumbVariants({ size }), checked ? translateMap[size!] : "translate-x-0")} />
  </button>
));
Switch.displayName = "Switch";

export { Switch };
