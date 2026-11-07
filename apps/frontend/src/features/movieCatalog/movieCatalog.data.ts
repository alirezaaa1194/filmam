import { AppApis } from "@/data";
import { CountryListType, GenreListType, LanguageListType, TagListType } from "@/types";
import { FilterOption, OptionKey } from "./movieCatalog.type";

export const filterOptionMeta: Record<OptionKey, { title: "genre" | "country" | "language" | "tags"; endpoint: string }> = {
  genres: { title: "genre", endpoint: AppApis.genre.all },
  countries: { title: "country", endpoint: AppApis.country.all },
  languages: { title: "language", endpoint: AppApis.language.all },
  tags: { title: "tags", endpoint: AppApis.tag.all },
};

export function optionFromRecord(kind: OptionKey, record: GenreListType | CountryListType | LanguageListType | TagListType): FilterOption {
  if (kind === "genres") {
    const item = record as GenreListType;
    return { value: item.slug, label: item.name };
  }
  if (kind === "countries") {
    const item = record as CountryListType;
    return { value: item.code, label: item.label };
  }
  if (kind === "languages") {
    const item = record as LanguageListType;
    return { value: item.code, label: item.label };
  }
  const item = record as TagListType;
  return { value: item.slug, label: item.label };
}
