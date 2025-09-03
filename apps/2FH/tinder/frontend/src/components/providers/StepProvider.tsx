'use client';

import React, { createContext, Dispatch, SetStateAction, PropsWithChildren, useContext, useState } from 'react';

type FormValues = {
  email: string;
  password: string;
};

type StepContextType = {
  values: FormValues;
  setValues: Dispatch<SetStateAction<FormValues>>;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
};

// Create the context with an empty default
const StepContext = createContext({} as StepContextType);

export const StepProvider = ({ children }: PropsWithChildren) => {
  // state for form values
  const [values, setValues] = useState<FormValues>({
    email: '',
    password: '',
  });

  // state for step
  const [step, setStep] = useState<number>(1);

  return (
    <StepContext.Provider
      value={{
        values,
        setValues,
        step,
        setStep,
      }}
    >
      {children}
    </StepContext.Provider>
  );
};

// custom hook for easy use
export const useStep = () => useContext(StepContext);
