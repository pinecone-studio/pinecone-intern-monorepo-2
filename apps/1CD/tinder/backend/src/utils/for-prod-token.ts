import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export const checkTokenInProd = ({req}:{ req: NextRequest}) => {
  const secretKey = `${process.env.TOKEN_SECRET}`;
  const authHeader = `${req.headers.get('Authorization')}`;
  const authToken = authHeader?.split(' ')[1];
  const isProd = process.env.ENVIRONMENT === 'production';

  console.log(process.env.TOKEN_SECRET, 'secretKey');
  console.log(req.headers.get('Authorization'), 'authHeader');

  console.log(authHeader?.split(' ')[1], 'authToken');

  console.log(process.env.ENVIRONMENT, 'isProd');


  if (authToken && isProd) {
    const { userId } = <jwt.JwtPayload>jwt.verify(authToken, secretKey);
    if (!userId) {
      console.log(userId, 'first null');
      return null;
    }
    console.log(userId, 'id in prod');
    return userId;
  }
  console.log(null, 'second null');
  return null;
};
