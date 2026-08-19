import { getRequestConfig } from "next-intl/server";
import { AppLanguagesEnum } from "@/types";

export default getRequestConfig(async ({ locale }) => {
  const messages = (await import(`./${locale}.ts`)).default;
  return {
    locale,
    messages,
  };
});