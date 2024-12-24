'use client';

import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

interface MessageContextType {
  setMessage: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  message: React.ReactNode;
}

export const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageContextWrapper = ({ children }: PropsWithChildren) => {
  const [message, setMessage] = useState<React.ReactNode>(null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <MessageContext.Provider value={{ setMessage, message }}>
      <>
        {children}
        {message}
      </>
    </MessageContext.Provider>
  );
};
export const useMessage = (): MessageContextType => {
  const context = useContext(MessageContext);

  if (!context) {
    throw new Error('useMessage must be used within a Whatever');
  }

  return context;
};
