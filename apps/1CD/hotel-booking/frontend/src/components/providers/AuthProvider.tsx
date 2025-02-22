/* eslint-disable-max-line */
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetUserLazyQuery, useLoginMutation, User } from 'src/generated';
import { AuthContextType, SignInParams } from './types/AuthTypes';
import { useQueryState } from 'nuqs';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [dateTo] = useQueryState('dateTo');
  const [dateFrom] = useQueryState('dateFrom');
  const router = useRouter();

  const searchParams = useSearchParams();

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
    const redirctTo = searchParams.get('redirect');
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
        if (redirctTo) {
          router.push(`${redirctTo}?dateTo=${dateTo}&dateFrom=${dateFrom}`);
        } else {
          router.push('/');
        }
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
