'use client';
import React, { createContext, useContext, ReactNode } from 'react';

interface UserContextType {
  userId: string | null;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ userId, children }: { userId: string | null; children: ReactNode }) => {
  return <UserContext.Provider value={{ userId }}>{children}</UserContext.Provider>;
};
export const useUserId = () => useContext(UserContext);
