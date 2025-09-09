'use client';

import { useAuth } from './AuthContext';

// UserContext provides backward compatibility with existing components
// by wrapping the new AuthContext
export const useUser = () => {
    const { user, token, isAuthenticated, login, logout, updateUser } = useAuth();

    return {
        user,
        token,
        isAuthenticated,
        loading: false, // AuthProvider handles loading internally
        login,
        logout,
        updateUser,
    };
};