'use client';

import React, { createContext, PropsWithChildren, useContext, useState } from 'react';

interface LoginContextType {
  email: string;
  expirationDate: string;
  setEmail:  void;
  setExpirationDate:  void;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const LoginProvider = ({ children }: PropsWithChildren) => {
  // Define state for email and expirationDate
  const [email, setEmail] = useState<string>('');
  const [expirationDate, setExpirationDate] = useState<string>('');

  return (
    <LoginContext.Provider
      value={{
        email,
        expirationDate,
        setEmail,
        setExpirationDate,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = (): LoginContextType => {
  const context = useContext(LoginContext);

  if (!context) {
    throw new Error('useLogin must be used within a LoginProvider');
  }

  return context;
};
