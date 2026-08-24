import { createContext } from "react";

export type AuthModeType = "Login" | "Signup" | "ForgetPassword" | null;
export const AuthModalContext = createContext<{ authMode: AuthModeType; setAuthMode: (authMode: AuthModeType) => void; callBack?: () => void }>({
  authMode: null,
  setAuthMode: (authMode: AuthModeType) => null,
  callBack: () => null,
});
