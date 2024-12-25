import { User } from '@/generated';

export type OtpParams = {
  otp: string;
  email: string;
};
export type SendOtpParams = {
  email: string;
};
export type PasswordParams = {
  email: string | null;
  password: string;
};
export type SignInParams = {
  email: string;
  password: string;
};
export type AuthContextType = {
  signin: (_params: SignInParams) => void;
  verifyOtp: (_params: OtpParams) => void;
  sendOtp: (_params: SendOtpParams) => void;
  setPassword: (_params: PasswordParams) => void;
  verifyEmail: (_params: SendOtpParams) => void;
  user: User | null;
  loginButton: () => void;
  signupButton: () => void;
};
