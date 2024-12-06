'use client';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { useForgetPasswordMutation, User, useSignupMutation } from 'src/generated';

type SignUp = {
  email: string;
  fullName: string;
  userName: string;
  password: string;
};

type ForgetPassword = { email: string };
type AuthContextType = {
  signup: (_params: SignUp) => void;
  user: User | null;
  forgetPassword: (_params: ForgetPassword) => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [signupMutation] = useSignupMutation({
    onCompleted: (data) => {
      localStorage.setItem('token', data.signup.token);
      setUser(data.signup.user as User);
      router.push('/');
    },
  });
  const signup = async ({ email, password, fullName, userName }: SignUp) => {
    await signupMutation({
      variables: {
        input: {
          email,
          password,
          fullName,
          userName,
        },
      },
    });
  };
  const [ForgetPasswordMutation] = useForgetPasswordMutation({
    onCompleted: () => {
      toast({ variant: 'default', title: 'Success', description: 'A password recovery link has been sent to your email address.' });
      router.push('/');
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Error', description: `${error.message}` });
    },
  });
  const forgetPassword = async ({ email }: ForgetPassword) => {
    await ForgetPasswordMutation({ variables: { input: { email } } });
  };
  return <AuthContext.Provider value={{ signup, user, forgetPassword }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
