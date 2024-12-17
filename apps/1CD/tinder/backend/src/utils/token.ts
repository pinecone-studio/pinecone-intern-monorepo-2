import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
export const getUserId = (req: NextRequest) => {
  const secretKey = process.env.TOKEN_SECRET || '';
  const authHeader = `${req.headers.get('Authorization')}`;
  const authToken = authHeader?.split(' ')[1];
  const isDev = process.env.NODE_ENV === 'development';
  

  if (!isDev && authToken) {
    const { userId } = <jwt.JwtPayload>jwt.verify(authToken, secretKey);
    if (!userId) {
      return null;
    }
    return userId;
  }
  return '675675e84bd85fce3de34006';
};
