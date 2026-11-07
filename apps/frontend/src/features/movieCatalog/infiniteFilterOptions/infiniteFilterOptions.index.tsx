"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AppLanguagesEnum, CountryListType, GenreListType, LanguageListType, PaginationType, TagListType } from "@/types";
import { ClientCall } from "@/scripts/client";
import { Checkbox } from "@/utilities/components/ui";
import { useLocale } from "@/hooks";
import { filterOptionMeta, optionFromRecord } from "../movieCatalog.data";
import { FilterOption, OptionKey } from "../movieCatalog.type";

export default function InfiniteFilterOptions({ kind, selected, onToggle, onOptionsLoaded, preloadOnly = false }: { kind: OptionKey; selected: string[]; onToggle: (value: string) => void; onOptionsLoaded: (kind: OptionKey, options: FilterOption[]) => void; preloadOnly?: boolean }) {
  const { locale, t } = useLocale();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const query = useInfiniteQuery({
    queryKey: ["movie-filter-options", kind, locale],
    queryFn: ({ pageParam }) => ClientCall<PaginationType<GenreListType | CountryListType | LanguageListType | TagListType>>(filterOptionMeta[kind].endpoint, {
      method: "GET",
      locale: locale as AppLanguagesEnum,
      query: { page: pageParam, page_size: 24 },
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => pages.reduce((total, page) => total + page.data.length, 0) < lastPage.count ? pages.length + 1 : undefined,
  });

  useEffect(() => {
    const element = sentinelRef.current;
    if (!element || !query.hasNextPage || query.isFetchingNextPage) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) void query.fetchNextPage(); }, { rootMargin: "160px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage]);

  const options = query.data?.pages.flatMap((page) => page.data.map((item) => optionFromRecord(kind, item))) ?? [];
  useEffect(() => onOptionsLoaded(kind, options), [kind, options, onOptionsLoaded]);
  useEffect(() => {
    if (!preloadOnly || !selected.length || !query.hasNextPage || query.isFetchingNextPage) return;
    if (selected.some((value) => !options.some((option) => option.value === value))) void query.fetchNextPage();
  }, [options, preloadOnly, query.fetchNextPage, query.hasNextPage, query.isFetchingNextPage, selected]);

  if (preloadOnly) return null;
  return (
    <div className="space-y-4">
      <div className="flex max-h-[52dvh] flex-wrap content-start gap-2 overflow-y-auto pe-1 sm:max-h-[440px]">
        {options.map((option) => {
          const checked = selected.includes(option.value);
          return (
            <div key={option.value} role="checkbox" aria-checked={checked} tabIndex={0} onClick={() => onToggle(option.value)} onKeyDown={(event) => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); onToggle(option.value); } }} className={`flex min-h-11 min-w-0 basis-[calc((100%-1rem)/3)] cursor-pointer items-center gap-2 rounded-md border px-2.5 py-2 text-start text-xs transition ${checked ? "border-primary bg-primary/10 text-white" : "border-gray-10 bg-gray-13 text-gray-4 hover:border-gray-8"}`}>
              <Checkbox checked={checked} disabled aria-hidden tabIndex={-1} className="pointer-events-none" />
              <span className="line-clamp-2 min-w-0">{option.label}</span>
            </div>
          );
        })}
      </div>
      {query.isPending ? <p className="py-2 text-center text-sm text-gray-7">{t("MovieCatalog.loading")}</p> : null}
      {!query.isPending && options.length === 0 ? <p className="py-2 text-center text-sm text-gray-7">{t("MovieCatalog.noOptions")}</p> : null}
      <div ref={sentinelRef} className="h-1" />
      {query.isFetchingNextPage ? <p className="text-center text-xs text-gray-8">{t("MovieCatalog.loading")}</p> : null}
    </div>
  );
}
