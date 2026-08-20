"use client";

import { BuildApiUrl, DefaultLanguage } from "../index";
import { AppApis } from "@/data";
import { MessageType, ApiCallOptionsType } from "@/types";

export async function ClientCall<T>(url: string, options: ApiCallOptionsType, retry = true): Promise<T> {
  const currentLanguage = options.locale || DefaultLanguage;

  const response = await fetch(BuildApiUrl(url, currentLanguage, options.query), {
    method: options.method,
    credentials: "include",
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      "content-type": "application/json",
    },
  });

  if (response.status === 401 && retry && url !== AppApis.auth.logout && url !== AppApis.auth.refresh) {
    const refreshResponse = await Refresh();

    if (refreshResponse.ok) {
      return await ClientCall<T>(url, options, false);
    }

    await LogOut();

    throw refreshResponse;
  }

  if (!response.ok) {
    throw response;
  }

  const data = await response.json();
  return data as T;
}

let refreshPromise: Promise<Response> | null = null;

export async function Refresh(): Promise<Response> {
  if (!refreshPromise) {
    refreshPromise = fetch(AppApis.auth.refresh, {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function LogOut(): Promise<void> {
  try {
    await ClientCall<MessageType>(AppApis.auth.logout, { method: "POST" });
  } catch {
    // token may already be invalid/rotated
  }
}