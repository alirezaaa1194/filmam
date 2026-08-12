import messages from "./messages/en.json";
import { AppLanguagesEnum } from "../types";

declare module "next-intl" {
  interface AppConfig {
    Locale: AppLanguagesEnum;
    Messages: typeof messages;
  }
}
