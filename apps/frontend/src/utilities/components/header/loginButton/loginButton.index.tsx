"use client";

import { use } from "react";
import { Button } from "../../ui/button";
import { AuthModalContext } from "../../../../contexts/authModal";
import { useLocale } from "../../../../hooks";
import { AuthModeEnum } from "../../../../types";

function HeaderLoginButton() {
  const { setAuthMode } = use(AuthModalContext);
  const { t } = useLocale();
  return (
    <Button onClick={() => setAuthMode(AuthModeEnum.LOGIN)} className="min-w-20 h-8 rounded-md cursor-pointer text-button-s hidden lg:block">
      {t("Header.login")}
    </Button>
  );
}

export default HeaderLoginButton;
