import { User } from '@/generated';

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
  verifyOtp: (_params: OtpParams) => void;
  sendOtp: (_params: SendOtpParams) => void;
  setPassword: (_params: PasswordParams) => void;
  verifyEmail: (_params: SendOtpParams) => void;
  forgetPassVerifyOtp: (_params: OtpParams) => void;
  updatePassword: (_params: PasswordParams) => void;
  user: User | null;
  loginButton: () => void;
  signupButton: () => void;
};
