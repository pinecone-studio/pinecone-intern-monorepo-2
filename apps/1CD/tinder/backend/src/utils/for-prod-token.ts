import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export const checkTokenInProd = ({req}:{ req: NextRequest}) => {
  const secretKey = `${process.env.TOKEN_SECRET}`;
  const authHeader = `${req.headers.get('Authorization')}`;
  const authToken = authHeader?.split(' ')[1];
  const isProd = process.env.ENVIRONMENT === 'production';

  if (authToken && isProd) {
    console.log({secretKey, authToken,authHeader, isProd},'secretKey || authToken || authHeader || isProd'); 
    const { userId } = <jwt.JwtPayload>jwt.verify(authToken, secretKey);
    if (!userId) {
      console.log(null, 'first null');
      return null;
    }
    console.log(userId, 'userId in chechTokenInProd');
    return userId;
  }
  console.log(null, 'second null');
  return null;
};
