// this is check-token.ts

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  role: string;
}

const getTokenFromCookies = (): string | null => {
  const cookieStore = cookies();
  return cookieStore.get('authtoken')?.value || null;
};

const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (typeof decoded === 'object' && 'role' in decoded) {
      return decoded as JwtPayload;
    }
    return null;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

export const checkToken = async (role: string): Promise<boolean> => {
  const token = getTokenFromCookies();
  if (!token) return false;

  const decoded = verifyToken(token);
  return decoded?.role === role || false;
};
