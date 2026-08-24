import { useState } from "react";
import { AuthModalContext, AuthModeType } from "../contexts/authModal";
import AuthModal from "../features/auth/auth.index";

function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [authMode, setAuthMode] = useState<AuthModeType>(null);
  return (
    <AuthModalContext value={{ authMode, setAuthMode }}>
      {children} <AuthModal />
    </AuthModalContext>
  );
}

export default AuthModalProvider;
