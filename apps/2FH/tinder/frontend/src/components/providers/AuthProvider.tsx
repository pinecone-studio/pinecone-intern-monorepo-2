'use client';

import { useState, useEffect, ReactNode } from 'react';
import { AuthContext, User } from '@/contexts/AuthContext';

interface AuthProviderProps {
    children: ReactNode;
}

const AUTH_STORAGE_KEY = 'tinder_auth';
const TOKEN_STORAGE_KEY = 'tinder_token';

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth state from localStorage on mount
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
                const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

                if (storedUser && storedToken) {
                    setUser(JSON.parse(storedUser));
                    setToken(storedToken);
                }
            } catch (error) {
                console.error('Error initializing auth state:', error);
                // Clear corrupted data
                localStorage.removeItem(AUTH_STORAGE_KEY);
                localStorage.removeItem(TOKEN_STORAGE_KEY);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = (userData: User, userToken: string) => {
        setUser(userData);
        setToken(userToken);

        // Persist to localStorage
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
        localStorage.setItem(TOKEN_STORAGE_KEY, userToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('userId');

        // Clear localStorage
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
        }
    };

    const value = {
        user,
        token,
        isAuthenticated: !!user && !!token,
        login,
        logout,
        updateUser,
    };

    // Show loading state while initializing
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};