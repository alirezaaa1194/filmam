import { createContext } from "react";
import { AuthModeType } from "../types";

export type AuthModeValueType = {
  mode: AuthModeType;
  callback?: () => void;
};

export type AuthModalContextValueType = {
  authMode: AuthModeValueType | null;
  setAuthMode: (authMode: AuthModeValueType | null) => void;
};

export const AuthModalContext = createContext<AuthModalContextValueType>({
  authMode: null,
  setAuthMode: () => null,
});
