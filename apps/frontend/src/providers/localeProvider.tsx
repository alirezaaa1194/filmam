import { PropsWithChildren, useState } from "react";
import { LocaleContext } from "../contexts";
import { AppLanguagesEnum } from "../types";
import { GetDir } from "../scripts";

function LocaleProvider({ children, initialLocale }: PropsWithChildren<{ initialLocale: AppLanguagesEnum }>) {
  const [locale, setLocale] = useState<AppLanguagesEnum>(initialLocale);
  return (
    <LocaleContext value={{ locale, setLocale }}>
      <div dir={GetDir(locale)}>{children}</div>
    </LocaleContext>
  );
}

export default LocaleProvider;
