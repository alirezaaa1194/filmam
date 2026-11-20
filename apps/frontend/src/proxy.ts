import { NextRequest, NextResponse } from "next/server";
import { AppApis } from "./data";
import { ParseSetCookie, DefaultLanguage } from "./scripts";

export async function proxy(req: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production";
  const isUserPanelRoute = req.nextUrl.pathname === "/profile" || req.nextUrl.pathname.startsWith("/profile/");
  const isForbiddenRoute = req.nextUrl.pathname === "/403";
  const redirectResponse = (response: NextResponse, pathname: string) => {
    const redirect = NextResponse.redirect(new URL(pathname, req.url));
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  };

  if (req.cookies.get("accessToken")?.value) {
    if (isForbiddenRoute) return redirectResponse(NextResponse.next(), "/profile");
    return NextResponse.next();
  }

  const response = NextResponse.next();

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
    if (isUserPanelRoute) {
      return redirectResponse(response, "/403");
    }
    return response;
  }

  for (const setCookie of refreshResponse.headers.getSetCookie()) {
    const { name, value, options } = ParseSetCookie(setCookie);

    if (!isProduction) {
      delete options.domain;
    }

    options.secure = isProduction;

    response.cookies.set(name, value, options);
  }

  if (isForbiddenRoute) return redirectResponse(response, "/profile");

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
