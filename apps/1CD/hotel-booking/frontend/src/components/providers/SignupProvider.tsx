'use client';
import { createContext, PropsWithChildren, useContext } from 'react';
import { OtpParams, PasswordParams, SendOtpParams, SignupContextType } from './types/AuthTypes';
import { Response, useSendOtpMutation, useSetPasswordMutation, useUpdatePasswordMutation, useVerifyEmailMutation, useVerifyOtpMutation } from '@/generated';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const SignupContext = createContext<SignupContextType>({} as SignupContextType);

export const SignupProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();

  const [sendOtpMutation] = useSendOtpMutation();
  const [verifyOtpMutation] = useVerifyOtpMutation();
  const [setPasswordMutation] = useSetPasswordMutation();
  const [verifyEmailMutation] = useVerifyEmailMutation();
  const [updatePasswordMutation] = useUpdatePasswordMutation();

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
        localStorage.removeItem('userEmail');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };
  const forgetPassVerifyOtp = async ({ otp, email }: OtpParams) => {
    await verifyOtpMutation({
      variables: {
        input: {
          otp,
          email,
        },
      },
      onCompleted: () => {
        router.push('/forget-password/update-password');
        toast.success(Response.Success);
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
  const updatePassword = async ({ email, password }: PasswordParams) => {
    await updatePasswordMutation({
      variables: {
        input: {
          password,
          email,
        },
      },
      onCompleted: () => {
        router.push('/login');
        toast.success('Password updated successfully');
        localStorage.removeItem('userEmail');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };
  return <SignupContext.Provider value={{ verifyOtp, sendOtp, setPassword, verifyEmail, forgetPassVerifyOtp, updatePassword }}>{children}</SignupContext.Provider>;
};
export const useSignup = () => useContext(SignupContext);
