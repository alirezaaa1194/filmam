import ConfirmModal from "../utilities/components/confirmModal/confirmModal.index";
import { ConfirmModalContext } from "../contexts/confirm";
import { useState } from "react";
import { ConfirmModalValueType } from "../types";

function ConfirmModalProvider({ children }: { children: React.ReactNode }) {
  const [confirm, setConfirm] = useState<ConfirmModalValueType | null>(null);

  return (
    <ConfirmModalContext value={{ confirm, setConfirm }}>
      {children} <ConfirmModal />
    </ConfirmModalContext>
  );
}

export default ConfirmModalProvider;
