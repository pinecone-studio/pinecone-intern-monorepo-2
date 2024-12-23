'use client';

import { useRouter } from 'next/navigation';
import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { Response, useLoginMutation, User, useSendOtpMutation, useSetPasswordMutation, useVerifyEmailMutation, useVerifyOtpMutation } from 'src/generated';
import { AuthContextType, OtpParams, PasswordParams, SendOtpParams, SignInParams } from './types/AuthTypes';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const [signinMutation] = useLoginMutation();
  const [sendOtpMutation] = useSendOtpMutation();
  const [verifyOtpMutation] = useVerifyOtpMutation();
  const [setPasswordMutation] = useSetPasswordMutation();
  const [verifyEmailMutation] = useVerifyEmailMutation();

  const signin = async ({ email, password }: SignInParams) => {
    await signinMutation({
      variables: {
        input: {
          email,
          password,
        },
      },
      onCompleted: (data) => {
        localStorage.setItem('token', data.login.token);
        setUser(data.login.user);
        router.push('/');
      },
      onError: (error) => {
        toast.error(error.message);
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
        router.push('/signup/otp');
        localStorage.setItem('userEmail', email);
        toast.success(Response.Success);
      },
      onError: (error) => {
        toast.error(error.message);
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
        router.push('/signup/password');
        toast.success(Response.Success);
      },
      onError: (error) => {
        toast.error(error.message);
        console.log('error message', error.message);
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
      onCompleted: () => {
        router.push('/login');
        toast.success('Profile created successfully');
        localStorage.removeItem('email');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const verifyEmail = async ({ email }: SendOtpParams) => {
    await verifyEmailMutation({
      variables: {
        input: {
          email,
        },
      },
      onCompleted: () => {
        router.push('/forget-password/otp');
        localStorage.setItem('userEmail', email);
        toast.success(Response.Success);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return <AuthContext.Provider value={{ signin, verifyOtp, sendOtp, setPassword, verifyEmail, user }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
