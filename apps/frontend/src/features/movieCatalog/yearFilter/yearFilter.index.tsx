"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/hooks";
import { Slider } from "@/utilities/components/ui/slider";
import { MovieFilters } from "../movieCatalog.script";
import FilterField from "../filterField/filterField.index";

const currentYear = new Date().getFullYear();
const firstReleaseYear = 1900;

export default function YearFilter({ filters, mobile, onCommit }: { filters: MovieFilters; mobile: boolean; onCommit: (next: MovieFilters) => void }) {
  const { t } = useLocale();
  const initialRange: [number, number] = [filters.released_year_from ?? firstReleaseYear, filters.released_year_to ?? currentYear];
  const [range, setRange] = useState<[number, number]>(initialRange);
  useEffect(() => setRange(initialRange), [filters.released_year_from, filters.released_year_to]);
  const commitRange = ([from, to]: number[]) => onCommit({ ...filters, released_year_from: from, released_year_to: to });
  const hasYearRange = filters.released_year_from !== undefined || filters.released_year_to !== undefined;
  return (
    <FilterField title={t("MovieCatalog.releaseYear")} summary={hasYearRange ? `${range[0]} – ${range[1]}` : t("MovieCatalog.releaseYear")} mobile={mobile}>
      <div className="space-y-5 px-1 py-2">
        <div className="flex justify-between text-sm text-gray-5"><span>{range[0]}</span><span>{range[1]}</span></div>
        <Slider dir="ltr" min={firstReleaseYear} max={currentYear} step={1} value={range} onValueChange={(value) => setRange(value as [number, number])} onValueCommit={commitRange} className="cursor-pointer py-2" />
        <p className="text-xs text-gray-8">{t("MovieCatalog.releaseYear")}</p>
      </div>
    </FilterField>
  );
}
