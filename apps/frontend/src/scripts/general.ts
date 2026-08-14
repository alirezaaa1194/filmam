import { cache } from "react";

import { AppApis } from "../data";
import { __ServerCall as ServerCall } from "./serverCall";
import { UserType } from "../types";
import { Locale } from "../i18n/config";

export const __GetCurrentUser = cache(async (locale: Locale): Promise<UserType | null> => {
  try {
    return await ServerCall<UserType>(AppApis.auth.me, { method: "GET", locale });
  } catch {
    return null;
  }
});