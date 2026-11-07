"use client";

import { Checkbox } from "@/utilities/components/ui";
import { FilterOption } from "../movieCatalog.type";

export default function ChoiceChips({ options, selected, onToggle }: { options: FilterOption[]; selected: string[]; onToggle: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const checked = selected.includes(option.value);
        return (
          <div key={option.value} role="checkbox" aria-checked={checked} tabIndex={0} onClick={() => onToggle(option.value)} onKeyDown={(event) => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); onToggle(option.value); } }} className={`flex h-9 cursor-pointer items-center gap-2 rounded-md border px-3 text-xs ${checked ? "border-primary bg-primary/10 text-white" : "border-gray-10 bg-gray-13 text-gray-4"}`}>
            <Checkbox checked={checked} disabled aria-hidden tabIndex={-1} className="pointer-events-none size-3.5" />
            <span className="whitespace-nowrap">{option.label}</span>
          </div>
        );
      })}
    </div>
  );
}
