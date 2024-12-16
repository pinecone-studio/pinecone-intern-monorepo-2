'use client';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { createContext, PropsWithChildren, useContext, useState, useEffect } from 'react';
import { useForgetPasswordMutation, User, useSignupMutation, useResetPasswordMutation, useGetUserLazyQuery, useLoginMutation } from 'src/generated';

type SignUp = {
  email: string;
  fullName: string;
  userName: string;
  password: string;
};

type LogIn = {
  email: string;
  password: string;
};

type ForgetPassword = { email: string };

type ResetPassword = { password: string; resetToken: string };

type AuthContextType = {
  signup: (_params: SignUp) => void;
  login: (_params: LogIn) => void;
  signout: () => void;
  user: User | null;
  forgetPassword: (_params: ForgetPassword) => void;
  resetPassword: (_params: ResetPassword) => void;
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

  const [signinMutation] = useLoginMutation({
    onCompleted: (data) => {
      localStorage.setItem('token', data.login.token);
      setUser(data.login.user as User);
      router.push('/home');
    },
  });

  const [getUser] = useGetUserLazyQuery({
    onCompleted: (data) => {
      setUser(data.getUser);
    },
  });

  const login = async ({ email, password }: LogIn) => {
    await signinMutation({
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
    router.push('/');
  };

  useEffect(() => {
    getUser();
  }, [getUser]);

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

  const [resetPasswordMutatuion] = useResetPasswordMutation({
    onCompleted: () => {
      toast({ variant: 'default', title: 'Success', description: 'password recovery link sent to email' });
      router.push('/');
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Error', description: `${error.message}` });
    },
  });

  const resetPassword = async ({ password, resetToken }: ResetPassword) => {
    await resetPasswordMutatuion({ variables: { input: { password, resetToken } } });
  };

  return <AuthContext.Provider value={{ signup, user, forgetPassword, resetPassword, login, signout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
