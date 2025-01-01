import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAuthCallBackUrl = () => (typeof window !== 'undefined' ? new URL(window.location.href).origin : undefined);
