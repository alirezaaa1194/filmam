import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AppApis } from "@/data";
import { localeCookieName } from "@/i18n/config";

export async function POST() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const backendResponse = await fetch(AppApis.auth.logout, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    cache: "no-store",
  });

  const data = await backendResponse.json().catch(() => null);
  const response = NextResponse.json(data, {
    status: backendResponse.status,
  });

  backendResponse.headers
    .getSetCookie()
    .forEach((cookie) => response.headers.append("set-cookie", cookie));

  response.cookies.delete(localeCookieName);

  return response;
}