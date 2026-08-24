import { NextRequest, NextResponse } from "next/server";
import { AppApis } from "./data";
import { ParseSetCookie, DefaultLanguage } from "./scripts";

const AUTH_COOKIE_NAMES = ["accessToken", "refreshToken"];

function TombstoneLegacyHostCookies(req: NextRequest, response: NextResponse) {
  for (const name of AUTH_COOKIE_NAMES) {
    if (req.cookies.has(name)) {
      response.cookies.set(name, "", { path: "/", maxAge: 0 });
    }
  }
}

export async function proxy(req: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";
  const response = NextResponse.next();

  if (req.cookies.get("accessToken")?.value) {
    if (isProduction) {
      TombstoneLegacyHostCookies(req, response);
    }

    return response;
  }

  if (!req.cookies.has("locale")) {
    response.cookies.set("locale", DefaultLanguage);
  }

  const refreshResponse = await fetch(AppApis.auth.refresh, {
    method: "POST",
    headers: {
      Cookie: req.cookies.toString(),
    },
    cache: "no-store",
  });

  if (!refreshResponse.ok) {
    if (isProduction) {
      TombstoneLegacyHostCookies(req, response);
    }

    return response;
  }

  for (const setCookie of refreshResponse.headers.getSetCookie()) {
    const { name, value, options } = ParseSetCookie(setCookie);

    options.secure = isProduction;

    response.cookies.set(name, value, options);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
