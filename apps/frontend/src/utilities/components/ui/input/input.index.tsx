import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-xl border border-gray-12 bg-black px-4 py-1 text-base text-white transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-10 hover:border-gray-11 hover:bg-gray-12 focus:border-primary focus:bg-black focus:shadow-[0px_0px_0px_4px_rgba(0,146,93,0.2)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-black disabled:opacity-50 aria-invalid:border-error aria-invalid:shadow-[0px_0px_0px_4px_rgba(195,0,0,0.2)] md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
