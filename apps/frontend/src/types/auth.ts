import { UserType } from ".";

export interface __AuthUser {
  accountNo: string;
  email: string;
  role: string[];
  exp: number;
}

export interface __UserState {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
}
