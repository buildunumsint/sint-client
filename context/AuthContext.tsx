import React, { createContext, useCallback, useContext, useState } from "react";

export type AuthUser = {
  user_id: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  email: string;
  phone: string;
  address: string;
  is_active: boolean;
  user_roles: Array<any>;
  parish_memberships: Array<any>;
};

export type AuthState = {
  session_id: string;
  access_token: string;
  refresh_token: string;
  access_token_expires_at: string;
  refresh_token_expires_at: string;
  user: AuthUser;
};

export type AuthContextType = AuthState & {
  updateAccessToken: (token: string) => void;
  updateValues: (data: Partial<AuthState> & { user?: Partial<AuthUser> }) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthContextProvider");
  }
  return ctx;
};

const INIT_VALUES: AuthState = {
  session_id: "",
  access_token: "",
  refresh_token: "",
  access_token_expires_at: "",
  refresh_token_expires_at: "",
  user: {
    user_id: "",
    first_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    email: "",
    phone: "",
    address: "",
    is_active: false,
    user_roles: [],
    parish_memberships: [],
  },
};


interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [values, setValues] = useState<AuthState>(INIT_VALUES);
  const updateAccessToken: AuthContextType["updateAccessToken"] = (token) => {
    setValues((prev) => ({
      ...prev,
      access_token: token,
    }));
  };
  const updateValues: AuthContextType["updateValues"] = (data) => {
    setValues((prev) => ({
      ...prev,
      ...data,
      user: data.user ? { ...prev.user, ...data.user } : prev.user,
    }));
  };

  const signOut = useCallback(() => {
    setValues(INIT_VALUES);
  }, []);

  const authProviderValues: AuthContextType = {
    ...values,
    updateAccessToken,
    updateValues,
    signOut,
  };

  return <AuthContext.Provider value={authProviderValues}>{children}</AuthContext.Provider>;
};
