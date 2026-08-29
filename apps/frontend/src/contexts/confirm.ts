import { createContext } from "react";
import { ConfirmModalValueType } from "../types";

export const ConfirmModalContext = createContext<{
  confirm: ConfirmModalValueType | null;
  setConfirm: (confirm: ConfirmModalValueType | null) => void;
}>({ confirm: null, setConfirm: () => null });
