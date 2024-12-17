"use server"

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const getEmail = async() => {
  const cookieStore = cookies();
  const token = cookieStore.get('authtoken')?.value || '';
  const decoded = await jwt.decode(token);

  if (decoded && typeof decoded === 'object') {
    const { email } = decoded;
    console.log(email)
    return email;
  }
};
