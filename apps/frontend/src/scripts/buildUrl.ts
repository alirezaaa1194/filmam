import { ApiQueryType, AppLanguagesEnum } from "../types";

export function buildApiUrl(
  url: string,
  locale: AppLanguagesEnum,
  query?: Record<string, unknown> | ApiQueryType,
): string {
  const searchParams = new URLSearchParams({ lang: locale });
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
  }
  return `${url}?${searchParams.toString()}`;
}
