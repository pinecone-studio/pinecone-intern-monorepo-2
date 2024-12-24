"use server"

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const getEmail = () => {
  const cookieStore = cookies();
  const token = cookieStore.get('authtoken')?.value || '';
  const decoded =  jwt.decode(token);

  if (decoded && typeof decoded === 'object') {
    const { email } = decoded;
    return email;
  }
};
