"use client";

import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Slider({ className, defaultValue, value, min = 0, max = 100, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(() => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]), [value, defaultValue, min, max]);

  return (
    <SliderPrimitive.Root data-slot="slider" defaultValue={defaultValue} value={value} min={min} max={max} className={cn("relative flex w-full touch-none items-center select-none data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col", className)} {...props}>
      <SliderPrimitive.Track data-slot="slider-track" className="relative grow overflow-hidden rounded-full bg-gray-8 cursor-pointer data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1">
        <SliderPrimitive.Range data-slot="slider-range" className="absolute bg-primary select-none data-horizontal:h-full data-vertical:w-full" />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb data-slot="slider-thumb" key={index} className="relative block size-3 shrink-0 cursor-pointer select-none rounded-full border border-primary! bg-primary ring-primary! ring-ring/50 transition-[color,box-shadow] after:absolute after:-inset-2 enabled:hover:ring-3 enabled:focus-visible:ring-3 enabled:active:ring-3 focus-visible:outline-hidden disabled:pointer-events-none disabled:ring-ring/50!" />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
