"use client";

import { Fragment, useCallback, useState } from "react";
import { Filter } from "iconsax-react";
import { MovieTypeEnum } from "@/types";
import { useLocale } from "@/hooks";
import { Button } from "@/utilities/components/ui";
import { MovieFilters } from "../movieCatalog.script";
import { filterOptionMeta } from "../movieCatalog.data";
import { FilterOption, OptionKey } from "../movieCatalog.type";
import FilterField from "../filterField/filterField.index";
import InfiniteFilterOptions from "../infiniteFilterOptions/infiniteFilterOptions.index";
import ChoiceChips from "../choiceChips/choiceChips.index";
import YearFilter from "../yearFilter/yearFilter.index";

export default function MovieFiltersPanel({ filters, onChange, onApply, onYearCommit, mobile }: { filters: MovieFilters; onChange: (filters: MovieFilters) => void; onApply: () => void; onYearCommit: (filters: MovieFilters) => void; mobile: boolean }) {
  const { t } = useLocale();
  const [optionLabels, setOptionLabels] = useState<Partial<Record<OptionKey, FilterOption[]>>>({});
  const onOptionsLoaded = useCallback((kind: OptionKey, options: FilterOption[]) => {
    setOptionLabels((current) => {
      const previous = current[kind] ?? [];
      if (previous.length === options.length && previous.every((item, index) => item.value === options[index]?.value && item.label === options[index]?.label)) return current;
      return { ...current, [kind]: options };
    });
  }, []);
  const toggleValue = (key: OptionKey, value: string) => {
    const current = filters[key] ?? [];
    onChange({ ...filters, [key]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value] });
  };
  const toggleAge = (age: number) => {
    const current = filters.age_limits ?? [];
    onChange({ ...filters, age_limits: current.includes(age) ? current.filter((item) => item !== age) : [...current, age] });
  };
  const summarize = (key: OptionKey, title: string) => {
    const selected = filters[key] ?? [];
    if (!selected.length) return title;
    const labels = optionLabels[key] ?? [];
    return selected.map((value) => labels.find((option) => option.value === value)?.label ?? value).join("، ");
  };
  const typeOptions: FilterOption[] = [
    { value: "CINEMATIC", label: t("MovieCatalog.cinematic") },
    { value: "SERIES", label: t("MovieCatalog.series") },
  ];
  const ageOptions: FilterOption[] = [0, 7, 13, 16, 18].map((age) => ({ value: String(age), label: age === 0 ? "G" : `${age}+` }));
  const hasSelectedFilter = Boolean(
    filters.search?.trim() || filters.section || filters.type || filters.genres?.length || filters.countries?.length ||
    filters.languages?.length || filters.tags?.length || filters.age_limits?.length ||
    filters.released_year_from !== undefined || filters.released_year_to !== undefined || filters.sort_by || filters.sort_order,
  );

  return (
    <div className={`grid grid-cols-2 items-center gap-3 ${mobile ? "" : "xl:grid-cols-[repeat(7,minmax(0,1fr))_auto]"}`}>
      <FilterField title={t("MovieCatalog.type")} summary={filters.type ? (filters.type === MovieTypeEnum.SERIES ? t("MovieCatalog.series") : t("MovieCatalog.cinematic")) : t("MovieCatalog.type")} mobile={mobile}>
        <ChoiceChips options={[{ value: "ALL", label: t("MovieCatalog.all") }, ...typeOptions]} selected={filters.type ? [filters.type] : ["ALL"]} onToggle={(value) => onChange({ ...filters, type: value === "ALL" || filters.type === value ? undefined : value })} />
      </FilterField>

      {(["languages", "age_limits", "countries", "genres", "tags"] as const).map((key) => {
        if (key === "age_limits") {
          return <FilterField key={key} title={t("MovieCatalog.ageLimit")} summary={filters.age_limits?.length ? filters.age_limits.map((age) => age === 0 ? "G" : `${age}+`).join("، ") : t("MovieCatalog.ageLimit")} mobile={mobile}>
            <ChoiceChips options={ageOptions} selected={(filters.age_limits ?? []).map(String)} onToggle={(value) => toggleAge(Number(value))} />
          </FilterField>;
        }
        const optionKey = key as OptionKey;
        const title = t(`MovieCatalog.${filterOptionMeta[optionKey].title}`);
        const selected = filters[optionKey] ?? [];
        return <Fragment key={optionKey}>
          <FilterField title={title} summary={summarize(optionKey, title)} mobile={mobile}>
            <InfiniteFilterOptions kind={optionKey} selected={selected} onToggle={(value) => toggleValue(optionKey, value)} onOptionsLoaded={onOptionsLoaded} />
          </FilterField>
          {selected.length ? <InfiniteFilterOptions kind={optionKey} selected={selected} onToggle={(value) => toggleValue(optionKey, value)} onOptionsLoaded={onOptionsLoaded} preloadOnly /> : null}
        </Fragment>;
      })}

      <YearFilter filters={filters} mobile={mobile} onCommit={onYearCommit} />
      <Button type="button" onClick={onApply} disabled={!hasSelectedFilter} className={`h-11 cursor-pointer gap-2 rounded-md px-4 disabled:cursor-not-allowed disabled:bg-gray-11 disabled:text-gray-8 disabled:opacity-100 ${mobile ? "col-span-2 w-full" : "col-span-2 xl:col-span-1"}`}><Filter className={`size-4 ${hasSelectedFilter ? "fill-white" : "fill-gray-8"}`} />{t("MovieCatalog.apply")}</Button>
    </div>
  );
}
