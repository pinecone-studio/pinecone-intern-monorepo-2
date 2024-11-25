'use client';

import { User, useSignUpMutation } from '@/generated';
import { useRouter } from 'next/navigation';
import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { toast } from 'react-toastify';

type SignUpParams = {
  email: string;
  password: string;
};

// type SignInParams = {
//   email: string;
//   password: string;
// };

// type ChangePasswordParams = {
//   email: string;
//   password: string;
//   otp: string;
// };

// type RequestChangePasswordParams = {
//   email: string;
// };

type AuthContextType = {
  //   signin: (_params: SignInParams) => void;
  handleSignUp: (_params: SignUpParams) => void;
  signout: () => void;
  //   requestChangePassword: (_params: RequestChangePasswordParams) => void;
  //   changePassword: (_params: ChangePasswordParams) => void;
  user: User | null;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const [signUpMutation] = useSignUpMutation({
    onCompleted: () => {
      router.push('/');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSignUp = async ({ email, password }: SignUpParams) => {
    await signUpMutation({
      variables: {
        email,
        password,
      },
    });
  };

  const signout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ handleSignUp, user, signout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
