import { cookies } from "next/headers";
import { AppLanguagesEnum } from "@/types";

const manifestText = {
  [AppLanguagesEnum.FA]: {
    name: "فیلمام",
    short_name: "فیلمام",
    description: "تماشای فیلم و سریال در فیلمام",
    lang: "fa",
    dir: "rtl",
  },
  [AppLanguagesEnum.EN]: {
    name: "Filmam",
    short_name: "Filmam",
    description: "Watch movies and series on Filmam.",
    lang: "en",
    dir: "ltr",
  },
  [AppLanguagesEnum.AR]: {
    name: "فيلمام",
    short_name: "فيلمام",
    description: "شاهد الأفلام والمسلسلات على فيلمام.",
    lang: "ar",
    dir: "rtl",
  },
} as const;

export async function GET(request: Request) {
  const languageCookie = (await cookies()).get("locale")?.value;
  const languageParam = new URL(request.url).searchParams.get("lang")?.toUpperCase();
  const requestedLanguage = languageParam || languageCookie;
  const language = Object.values(AppLanguagesEnum).includes(requestedLanguage as AppLanguagesEnum)
    ? requestedLanguage as AppLanguagesEnum
    : AppLanguagesEnum.FA;
  const localized = manifestText[language];

  return Response.json({
    id: "/",
    ...localized,
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "any",
    background_color: "#0c0c0c",
    theme_color: "#0c0c0c",
    categories: ["video", "entertainment"],
    icons: [
      {
        src: "/icons/filmam-pwa.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
      {
        src: "/icons/filmam-pwa.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "maskable",
      },
    ],
  }, {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "private, no-store, max-age=0",
      Vary: "Cookie",
    },
  });
}
