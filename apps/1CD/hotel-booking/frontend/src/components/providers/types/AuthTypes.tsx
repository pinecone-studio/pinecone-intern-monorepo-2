import { User } from '@/generated';
import { Dispatch, SetStateAction } from 'react';

export type OtpParams = {
  otp: string;
  email: string;
};
export type SendOtpParams = {
  email: string;
};
export type PasswordParams = {
  email: string;
  password: string;
};
export type UpdatePasswordParams = {
  email: string;
  newPassword: string;
};
export type SignInParams = {
  email: string;
  password: string;
};
export type AuthContextType = {
  signin: (_params: SignInParams) => void;
  signout: () => void;
  setRefresh: Dispatch<SetStateAction<boolean>>;
  user: User | null | undefined;
  loginButton: () => void;
  signupButton: () => void;
};

export type SignupContextType = {
  verifyOtp: (_params: OtpParams) => void;
  sendOtp: (_params: SendOtpParams) => void;
  setPassword: (_params: PasswordParams) => void;
  verifyEmail: (_params: SendOtpParams) => void;
  forgetPassVerifyOtp: (_params: OtpParams) => void;
  updatePassword: (_params: PasswordParams) => void;
};
