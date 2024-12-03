'use client';
import { useRouter } from 'next/navigation';
import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { User, useSignupMutation } from 'src/generated';

type SignUp = {
  email: string;
  fullName: string;
  userName: string;
  password: string;
};

type AuthContextType = {
  signup: (_params: SignUp) => void;
  user: User | null;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [signupMutation] = useSignupMutation({
    onCompleted: (data) => {
      localStorage.setItem('token', data.signup.token);
      setUser({
        ...data.signup.user,
        accountVisibility: 'PUBLIC',
        createdAt: '',
        followerCount: 0,
        followingCount: 0,
        updatedAt: '',
      });
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
  return <AuthContext.Provider value={{ signup, user }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
