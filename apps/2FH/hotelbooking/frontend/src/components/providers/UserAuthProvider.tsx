'use client';

import { createContext, useContext, useState, ReactNode, useEffect, Dispatch, SetStateAction } from 'react';

type OtpContextType = {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: Dispatch<SetStateAction<string>>;
  otp: string;
  setOtp: Dispatch<SetStateAction<string>>;
  resetOtp: () => void;
  timeLeft: number;
  startTime: boolean;
  setStartTime: Dispatch<SetStateAction<boolean>>;
  setTimeLeft: Dispatch<SetStateAction<number>>;
};

const OtpContext = createContext<OtpContextType | null>(null);

export const UserAuthProvider = ({ children }: { children: ReactNode }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(90);
  const [startTime, setStartTime] = useState(false);

  useEffect(() => {
    if (!startTime) return;
    if (timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [startTime, timeLeft]);

  const resetOtp = () => {
    setStartTime(true);
    setTimeLeft(90);
    setStartTime(false);
    setTimeout(() => setStartTime(true), 0);
  };

  return (
    <OtpContext.Provider
      value={{
        step,
        setStep,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        otp,
        setOtp,
        timeLeft,
        startTime,
        setStartTime,
        resetOtp,
        setTimeLeft,
      }}
    >
      {children}
    </OtpContext.Provider>
  );
};

export const useOtpContext = () => {
  const ctx = useContext(OtpContext);
  if (!ctx) throw new Error('useOtpContext must be used inside OtpProvider');
  return ctx;
};
