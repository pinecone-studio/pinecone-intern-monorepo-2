'use client';

import { useRouter } from 'next/navigation';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useChangePasswordMutation, useGetMeLazyQuery, useLoginMutation, User, useRegisterMutation, useRequestChangePasswordMutation } from 'src/generated';

type SignUpParams = {
  email: string;
  password: string;
  address: string;
  firstName: string;
  lastName: string;
  phone: string;
};

type SignInParams = {
  email: string;
  password: string;
};

type ChangePasswordParams = {
  email: string;
  password: string;
  otp: string;
};

type RequestChangePasswordParams = {
  email: string;
};

type AuthContextType = {
  signin: (_params: SignInParams) => void;
  signup: (_params: SignUpParams) => void;
  signout: () => void;
  requestChangePassword: (_params: RequestChangePasswordParams) => void;
  changePassword: (_params: ChangePasswordParams) => void;
  user: User | null;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const [getMe] = useGetMeLazyQuery({
    onCompleted: (data) => {
      setUser(data.getMe);
    },
  });

  const [signinMutation] = useLoginMutation({
    onCompleted: (data) => {
      localStorage.setItem('token', data.login.token);
      setUser(data.login.user);
      router.push('/');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const [signupMutation] = useRegisterMutation({
    onCompleted: (data) => {
      localStorage.setItem('token', data.register.token);
      setUser(data.register.user);
      router.push('/');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const [requestChangePasswordMutation] = useRequestChangePasswordMutation({
    onCompleted: (data) => {
      toast.success('Амжилттай илгээлээ');
      router.push(`/change-password?email=${data.requestChangePassword.email}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const [changePasswordMutation] = useChangePasswordMutation({
    onCompleted: () => {
      toast.success('Амжилттай солигдлоо');
      router.push('/signin');
    },
    onError: (error) => {
      toast.error(error.message);
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
    });
  };

  const signup = async ({ email, password, address, firstName, lastName, phone }: SignUpParams) => {
    await signupMutation({
      variables: {
        input: {
          email,
          password,
          address,
          firstName,
          lastName,
          phone,
        },
      },
    });
  };

  const signout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const requestChangePassword = async ({ email }: RequestChangePasswordParams) => {
    await requestChangePasswordMutation({
      variables: {
        input: {
          email,
        },
      },
    });
  };

  const changePassword = async ({ email, password, otp }: ChangePasswordParams) => {
    await changePasswordMutation({
      variables: {
        input: {
          email,
          password,
          otp,
        },
      },
    });
  };

  useEffect(() => {
    getMe();
  }, [getMe]);

  return <AuthContext.Provider value={{ signin, signup, user, signout, requestChangePassword, changePassword }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
