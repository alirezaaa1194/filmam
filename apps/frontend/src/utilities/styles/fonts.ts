import localFont from "next/font/local";

export const inter = localFont({
  src: [
    {
      path: "../../../public/fonts/en/Inter-VariableFont_opsz_wght.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../../public/fonts/en/Inter-Italic-VariableFont_opsz_wght.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-en",
  display: "swap",
  preload: true,
});

export const iranYekan = localFont({
  src: [
    { path: "../../../public/fonts/fa/iranyekanwebthinfanum.woff", weight: "100", style: "normal" },
    { path: "../../../public/fonts/fa/iranyekanweblightfanum.woff", weight: "300", style: "normal" },
    { path: "../../../public/fonts/fa/iranyekanwebregularfanum.woff", weight: "400", style: "normal" },
    { path: "../../../public/fonts/fa/iranyekanwebmediumfanum.woff", weight: "500", style: "normal" },
    { path: "../../../public/fonts/fa/iranyekanwebboldfanum.woff", weight: "700", style: "normal" },
    { path: "../../../public/fonts/fa/iranyekanwebextraboldfanum.woff", weight: "800", style: "normal" },
    { path: "../../../public/fonts/fa/iranyekanwebblackfanum.woff", weight: "900", style: "normal" },
    { path: "../../../public/fonts/fa/iranyekanwebextrablackfanum.woff", weight: "950", style: "normal" },
  ],
  variable: "--font-fa",
  display: "swap",
  preload: true,
  adjustFontFallback: false,
});

export const ibmPlexSansArabic = localFont({
  src: [
    { path: "../../../public/fonts/ar/IBMPlexSansArabic-Thin.woff2", weight: "100", style: "normal" },
    { path: "../../../public/fonts/ar/IBMPlexSansArabic-ExtraLight.woff2", weight: "200", style: "normal" },
    { path: "../../../public/fonts/ar/IBMPlexSansArabic-Light.woff2", weight: "300", style: "normal" },
    { path: "../../../public/fonts/ar/IBMPlexSansArabic-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../../public/fonts/ar/IBMPlexSansArabic-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../../public/fonts/ar/IBMPlexSansArabic-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../../public/fonts/ar/IBMPlexSansArabic-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-ar",
  display: "swap",
  preload: true,
  adjustFontFallback: false,
});
