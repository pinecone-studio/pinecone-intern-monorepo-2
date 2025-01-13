/* eslint-disable-max-line */
'use client';

import { useRouter } from 'next/navigation';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useGetUserLazyQuery, useLoginMutation, User } from 'src/generated';
import { AuthContextType, SignInParams } from './types/AuthTypes';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [signinMutation] = useLoginMutation();

  const loginButton = () => {
    router.push('/login');
  };
  const signupButton = () => () => {
    router.push('/signup');
  };

  const [getUser] = useGetUserLazyQuery({
    onCompleted: (data) => {
      setUser(data.getUser);
    },
  });

  const signin = async ({ email, password }: SignInParams) => {
    await signinMutation({
      variables: {
        input: {
          email,
          password,
        },
      },
      onCompleted: (data) => {
        localStorage.setItem('token', data.login.token);
        setUser(data.login.user);
        router.push('/');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const signout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  useEffect(() => {
    if (token) {
      getUser();
    } else {
      setToken(localStorage.getItem('token'));
    }
  }, [token, refresh]);
  return <AuthContext.Provider value={{ signin, setRefresh, setUser, signout, user, getUser, loginButton, signupButton }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
