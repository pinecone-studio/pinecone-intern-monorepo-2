'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type User = {
  _id: string;
  fullName: string;
  userName: string;
  email?: string;
  profileImage?: string;
  bio?: string;
  isVerified?: boolean;
  followers?: string[];
  followings?: string[];
};

type AuthContextType = {
  // eslint-disable-next-line no-unused-vars
  user: User | null;
  // eslint-disable-next-line no-unused-vars
  token: string | null;
  isLoading: boolean;
  login: (_user: User, _token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = [
  '/login',
  '/signup',
  '/verify-otp',
  '/forgot-password',
  '/reset-password',
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const loadAuthData = useCallback(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error loading auth data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  useEffect(() => {
    loadAuthData();
    setIsLoading(false);
  }, [loadAuthData]);

  const isPublicRoute = (path: string) => PUBLIC_ROUTES.includes(path);

  const isAuthenticated = useCallback(() => !!(user && token), [user, token]);

  const getRedirectPath = useCallback(() => {
    const isPublic = isPublicRoute(pathname);
    const authenticated = isAuthenticated();
    if (!authenticated && !isPublic) return '/login';
    if (authenticated && ['/login', '/signup'].includes(pathname)) return '/';
    return null;
  }, [isAuthenticated, pathname]);

  useEffect(() => {
    if (isLoading) return;
    const redirectTo = getRedirectPath();
    if (redirectTo) router.push(redirectTo);
  }, [isLoading, pathname, router, isAuthenticated, getRedirectPath]);

  const login = (_user: User, _token: string) => {
    setUser(_user);
    setToken(_token);
    localStorage.setItem('token', _token);
    localStorage.setItem('user', JSON.stringify(_user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated: !!(user && token),
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};