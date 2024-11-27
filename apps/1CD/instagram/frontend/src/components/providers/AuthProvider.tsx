'use client';
import { createContext, PropsWithChildren, useContext } from 'react';

type SignUp = {
  email: string;
  fullName: string;
  userName: string;
  password: string;
};

type AuthContextType = {
  signup: (_params: SignUp) => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const signup = async ({ email, password, fullName, userName }: SignUp) => {
    await {
      variables: {
        input: {
          email,
          password,
          fullName,
          userName,
        },
      },
    };
  };
  return <AuthContext.Provider value={{ signup }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
