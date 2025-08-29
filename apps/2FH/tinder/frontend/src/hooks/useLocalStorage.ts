import { useState, } from 'react';
import { MatchedUser } from '../types/types';

export const useLocalStorage = (key: string, initialValue: MatchedUser | null) => {
    const [storedValue, setStoredValue] = useState<MatchedUser | null>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return initialValue;
        }
    });

    const setValue = (value: MatchedUser | null) => {
        try {
            setStoredValue(value);
            if (value === null) {
                window.localStorage.removeItem(key);
            } else {
                window.localStorage.setItem(key, JSON.stringify(value));
            }
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    };

    return [storedValue, setValue] as const;
}; 