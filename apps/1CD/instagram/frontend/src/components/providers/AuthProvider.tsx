'use client';
import { useRouter } from 'next/navigation';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { User, useSignupMutation, useGetUserLazyQuery, useLoginMutation } from 'src/generated';
// import { useToast } from '@/components/ui/use-toast';

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
type AuthContextType = {
  signup: (_params: SignUp) => void;
  login: (_params: LogIn) => void;
  signout: () => void;
  user: User | null;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  // const { toast } = useToast();

  const [signupMutation] = useSignupMutation({
    onCompleted: (data) => {
      localStorage.setItem('token', data.signup.token);
      setUser(data.signup.user as User);
      router.push('/');
    },
  });

  const [signinMutation] = useLoginMutation({
    onCompleted: (data) => {
      console.log('data', data);
      localStorage.setItem('token', data.login.token);
      setUser(data.login.user as User);
      router.push('/');
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

  const signout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    getUser();
  }, [getUser]);

  return <AuthContext.Provider value={{ signup, login, signout, user }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
