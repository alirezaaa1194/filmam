import { createContext } from "react";
import { AuthModeType } from "../types";

export const AuthModalContext = createContext<{ authMode: AuthModeType; setAuthMode: (authMode: AuthModeType) => void; callBack?: () => void }>({
  authMode: null,
  setAuthMode: (authMode: AuthModeType) => null,
  callBack: () => null,
});
