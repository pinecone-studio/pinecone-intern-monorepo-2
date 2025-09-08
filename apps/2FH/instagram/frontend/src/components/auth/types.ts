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
    bio?: string;
    isVerified?: boolean;
    followers?: {
      _id: string;
      userName: string;
      fullName: string;
      profileImage?: string;
    }[];
    followings?: {
      _id: string;
      userName: string;
      fullName: string;
      profileImage?: string;
    }[];
    posts?: string[]; 
    stories?: {
      _id: string;
    }[];
  }
  
  export type LoginResponse = {
    user: User;
    token: string;
  }
  