'use client';

import { LoginMutation, useLoginMutation, useSignUpMutation } from '@/generated';
import { useRouter } from 'next/navigation';
import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { toast } from 'sonner';
type SignUpParams = {
  email: string;
  password: string;
};

type AuthContextType = {
  handleSignUp: (_params: SignUpParams) => void;
  handleSignIn: (_params: SignUpParams) => void;
  signout: () => void;
  user: LoginMutation['login']['user'] | null;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [user, setUser] = useState<LoginMutation['login']['user'] | null>(null);

  const [signUpMutation] = useSignUpMutation({
    onCompleted: () => {
      router.push('/sign-in');
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
  const [signInMutation] = useLoginMutation({
    onCompleted: (data) => {
      localStorage.setItem('token', data.login.token);
      toast.success('Successfully login');

      if (data.login.user.role === 'user') {
        setUser(data.login.user);
        router.push('/home');
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const handleSignIn = async ({ email, password }: SignUpParams) => {
    await signInMutation({
      variables: {
        input: {
          email,
          password,
        },
      },
    });
  };

  const signout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ handleSignUp, handleSignIn, user, signout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
