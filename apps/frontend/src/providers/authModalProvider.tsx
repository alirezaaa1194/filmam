import { useState } from "react";
import { AuthModalContext } from "../contexts/authModal";
import AuthModal from "../features/auth/auth.index";
import { AuthModeType } from "../types";

function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [authMode, setAuthMode] = useState<AuthModeType>(null);
  return (
    <AuthModalContext value={{ authMode, setAuthMode }}>
      {children} <AuthModal />
    </AuthModalContext>
  );
}

export default AuthModalProvider;
