'use client';

import { LoginMutation, useGetMeLazyQuery, useLoginMutation, useSignUpMutation } from '@/generated';
import { useRouter } from 'next/navigation';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
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
  loading: boolean;
};
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<LoginMutation['login']['user'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [signUpMutation] = useSignUpMutation({
    onCompleted: () => {
      setLoading(false);
      router.push('/user/sign-in');
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.message);
    },
  });
  const [getMe] = useGetMeLazyQuery({
    onCompleted: (data) => {
      setUser(data.getMe);
    },
  });

  const handleSignUp = async ({ email, password }: SignUpParams) => {
    setLoading(true);
    await signUpMutation({
      variables: {
        email,
        password,
      },
    });
  };

  const [signInMutation] = useLoginMutation({
    onCompleted: (data) => {
      setLoading(false);
      if (data.login.user.role === 'admin') {
        router.push('/admin/home');
      } else {
        router.push('/user/home');
      }
      localStorage.setItem('token', data.login.token);
      setToken(data.login.token);
      setUser(data.login.user);
      toast.success('Successfully login');
    },
    onError: (error) => {
      setLoading(false);
      toast.error(error.message);
    },
  });
  const handleSignIn = async ({ email, password }: SignUpParams) => {
    setLoading(true);
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
  useEffect(() => {
    if (token) {
      //getme
      getMe();
    } else {
      setToken(localStorage.getItem('token'));
    }
  }, [token]);

  return <AuthContext.Provider value={{ handleSignUp, handleSignIn, user, signout, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
