
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
export const createTokenandCookie = async (user: { email: string; _id: string }) => {  
    const TOKEN_SECRET = process.env.TOKEN_SECRET || '';
    const token = await jwt.sign({ userId: user._id, email: user.email }, TOKEN_SECRET, { expiresIn: '1d' });
    await cookies().set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
    });
    return 'Token is created and set in the cookie';

};
