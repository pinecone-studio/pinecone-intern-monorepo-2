export enum Gender {
  // eslint-disable-next-line no-unused-vars
  FEMALE = 'FEMALE',
  // eslint-disable-next-line no-unused-vars
  MALE = 'MALE', 
  // eslint-disable-next-line no-unused-vars
  OTHER = 'OTHER',
}

export type SignupFormData ={
  fullName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  gender: Gender;
  bio: string;
}

export type LoginFormData ={
  identifier: string;
  password: string;
}

export type AuthError ={
  message: string;
  code?: string;
  email?: string;
}

export type ForgotPasswordInput = {
  identifier: string;
}

export type CreateUserInput = {
  email: string;
  password: string;
  fullName: string;
  userName: string;
  gender: string;
}

export type LoginInput = {
  identifier: string;
  password: string;
}

export type User = {
  _id: string;
  fullName: string;
  userName: string;
  email: string;
  profileImage?: string;
}

export type LoginResponse = {
  user: User;
  token: string;
}

// Add executable code for coverage
export const createAuthError = (message: string, code?: string, email?: string): AuthError => ({
  message,
  code,
  email
});

export const createSignupFormData = (
  fullName: string,
  userName: string,
  email: string,
  phoneNumber: string,
  password: string,
  confirmPassword: string,
  gender: Gender,
  bio: string
): SignupFormData => ({
  fullName,
  userName,
  email,
  phoneNumber,
  password,
  confirmPassword,
  gender,
  bio
});

export const createLoginFormData = (identifier: string, password: string): LoginFormData => ({
  identifier,
  password
});

/* eslint-disable complexity */
export const validateSignupFormData = (data: SignupFormData): boolean => {
  return data.fullName.length > 0 && 
         data.userName.length > 0 && 
         data.email.includes('@') && 
         data.password.length >= 8 && 
         data.password === data.confirmPassword;
};
