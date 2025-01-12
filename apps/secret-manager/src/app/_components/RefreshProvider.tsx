'use client';

import { createContext, PropsWithChildren, useContext, useState } from 'react';

type RefreshContextType = {
  refresh: () => void;
  refreshId: number;
};

const RefreshContext = createContext<RefreshContextType>({} as RefreshContextType);

export const RefreshProvider = ({ children }: PropsWithChildren) => {
  const [refresh, setRefresh] = useState(0);

  const refreshAction = () => {
    setRefresh((prev) => 1 - prev);
  };

  return <RefreshContext.Provider value={{ refresh: refreshAction, refreshId: refresh }}>{children}</RefreshContext.Provider>;
};

export const useRefresh = () => useContext(RefreshContext);
