import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import { User } from '../models';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export type JWTPayload = {
  userId: string;
  userName: string;
  iat?: number;
  exp?: number;
}

const handleJWTError = (error: unknown): never => {
  if (!(error instanceof Error)) {
    throw new GraphQLError('Token verification failed', {
      extensions: {
        code: 'TOKEN_VERIFICATION_FAILED'
      }
    });
  }

  if (error.name === 'TokenExpiredError') {
    throw new GraphQLError('Token has expired', {
      extensions: {
        code: 'TOKEN_EXPIRED'
      }
    });
  }
  
  if (error.name === 'JsonWebTokenError') {
    throw new GraphQLError('Invalid token', {
      extensions: {
        code: 'INVALID_TOKEN'
      }
    });
  }
  
  throw new GraphQLError('Token verification failed', {
    extensions: {
      code: 'TOKEN_VERIFICATION_FAILED'
    }
  });
};

export const verifyToken = async (token: string): Promise<JWTPayload> => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error: unknown) {
    return handleJWTError(error);
  }
};

export const getUserFromToken = async (token: string) => {
  const decoded = await verifyToken(token);
  const user = await User.findById(decoded.userId);
  
  if (!user) {
    throw new GraphQLError('User not found', {
      extensions: {
        code: 'USER_NOT_FOUND'
      }
    });
  }
  
  return user;
};

export const extractTokenFromHeader = (authHeader?: string): string => {
  if (!authHeader) {
    throw new GraphQLError('Authorization header is required', {
      extensions: {
        code: 'MISSING_AUTH_HEADER'
      }
    });
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  if (!token) {
    throw new GraphQLError('Token is required', {
      extensions: {
        code: 'MISSING_TOKEN'
      }
    });
  }
  
  return token;
};