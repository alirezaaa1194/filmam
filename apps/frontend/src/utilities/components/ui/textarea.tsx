import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea data-slot="textarea" className={cn("flex field-sizing-content min-h-16 w-full rounded-xl border border-gray-12 bg-black px-4 py-2 text-base text-white transition-all outline-none placeholder:text-gray-10 hover:border-gray-11 hover:bg-gray-12 focus:border-primary focus:bg-black focus:shadow-[0px_0px_0px_4px_rgba(0,146,93,0.2)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-black disabled:opacity-50 aria-invalid:border-error aria-invalid:shadow-[0px_0px_0px_4px_rgba(195,0,0,0.2)] md:text-sm", className)} {...props} />;
}

export { Textarea };
