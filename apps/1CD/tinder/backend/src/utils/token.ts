import { GraphQLError } from 'graphql';
import jwt from 'jsonwebtoken';
export const getUserId = (authToken: string) => {
  const secretKey = process.env.TOKEN_SECRET || '';
  try {
    const { userId } = <jwt.JwtPayload>jwt.verify(authToken, secretKey);
    if (!userId) {
      throw new GraphQLError('Token does not contain userId', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }
    return userId;
  } catch (error) {
    throw new GraphQLError('Error verifying token', {
      extensions: {
        code: 'UNAUTHENTICATED',
        exception: error,
      },
    });
  }
};
