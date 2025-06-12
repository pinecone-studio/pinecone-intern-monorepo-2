import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(...inputs));
}

export function getAuthCallBackUrl(): string | undefined {
  if (typeof window !== 'undefined' && window.location) {
    return window.location.origin;
  }
  return undefined;
}
