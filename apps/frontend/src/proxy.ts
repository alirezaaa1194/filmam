import { NextRequest, NextResponse } from "next/server";
import { AppApis } from "./data";
import { ParseSetCookie } from "./scripts/server";

export async function proxy(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  if (accessToken) {
    return NextResponse.next();
  }

  const refreshResponse = await fetch(AppApis.auth.refresh, {
    method: "POST",
    headers: {
      Cookie: req.cookies.toString(),
    },
    cache: "no-store",
  });

  const response = NextResponse.next();

  if (!refreshResponse.ok) {
    return response;
  }

  const isDevelopment = process.env.NODE_ENV !== "production";

  for (const setCookie of refreshResponse.headers.getSetCookie()) {
    const { name, value, options } = await ParseSetCookie(setCookie);

    if (isDevelopment) {
      delete options.domain;
      options.secure = false;
    }

    response.cookies.set(name, value, options);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
