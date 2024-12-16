
import jwt from 'jsonwebtoken';
export const getUserId = (authToken: string) => {
  const secretKey = process.env.TOKEN_SECRET || '';
  try {
    const { userId } = <jwt.JwtPayload>jwt.verify(authToken, secretKey);
    if (!userId) {
      return null;
    }
    return userId;
  } catch (error) {
    return null;
  }
};
