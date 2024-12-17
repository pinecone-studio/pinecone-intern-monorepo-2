'use client';

import { useRouter } from 'next/navigation';
import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { useLoginMutation, User, useSendOtpMutation, useSetPasswordMutation, useVerifyOtpMutation } from 'src/generated';

type OtpParams = {
  otp: string;
  email: string | undefined;
};

type SendOtpParams = {
  email: string;
};

type PasswordParams = {
  email: string | null;
  password: string;
};

type SignInParams = {
  email: string;
  password: string;
};

type AuthContextType = {
  signin: (_params: SignInParams) => void;
  verifyOtp: (_params: OtpParams) => void;
  sendOtp: (_params: SendOtpParams) => void;
  setPassword: (_params: PasswordParams) => void;
  user: User | null;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const [signinMutation] = useLoginMutation({
    onCompleted: (data) => {
      localStorage.setItem('token', data.login.token);
      setUser(data.login.user);
      router.push('/');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const [sendOtpMutation] = useSendOtpMutation();

  const [verifyOtpMutation] = useVerifyOtpMutation();

  const [setPasswordMutation] = useSetPasswordMutation({
    onCompleted: () => {
      router.push('/login');
      toast.success('Profile created successfully');
      localStorage.removeItem('email');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const signin = async ({ email, password }: SignInParams) => {
    await signinMutation({
      variables: {
        input: {
          email,
          password,
        },
      },
    });
  };

  const sendOtp = async ({ email }: SendOtpParams) => {
    await sendOtpMutation({
      variables: {
        input: {
          email,
        },
      },
      onCompleted: () => {
        router.push('/otp');
        toast.success('OTP sent successfully', { toastId: 'OTP-sent' });
      },
      onError: (error) => {
        toast.error(error.message, { toastId: 'error-toast' });
      },
    });
  };

  const verifyOtp = async ({ otp, email }: OtpParams) => {
    await verifyOtpMutation({
      variables: {
        input: {
          otp,
          email,
        },
      },
      onCompleted: () => {
        router.push('/password');
        toast.success('Email verified successfully', { toastId: 'success-verify-otp' });
      },
      onError: (error) => {
        toast.error(error.message, { toastId: 'Verify-Otp-Error' });
      },
    });
  };

  const setPassword = async ({ email, password }: PasswordParams) => {
    await setPasswordMutation({
      variables: {
        input: {
          password,
          email,
        },
      },
    });
  };

  return <AuthContext.Provider value={{ signin, verifyOtp, sendOtp, setPassword, user }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
