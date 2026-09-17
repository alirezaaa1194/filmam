import { createContext } from "react";
import { AuthModeType } from "../types";

export const AuthModalContext = createContext<{
  authMode: { mode: AuthModeType; callback?: () => void } | null;
  setAuthMode: (authMode: { mode: AuthModeType; callback?: () => void } | null) => void;
  // callBack?: () => void;
}>({
  authMode: null,
  setAuthMode: (authMode: { mode: AuthModeType; callback?: () => void } | null) => null,
  // callBack: () => null,
});
