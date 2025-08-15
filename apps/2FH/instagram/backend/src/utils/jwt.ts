import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import { User } from '../models';
import { getJwtSecret } from './check-jwt';

const JWT_SECRET = getJwtSecret()

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
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    }) as JWTPayload;
    return decoded;
  } catch (error: unknown) {
    return handleJWTError(error);
  }
};

const validateUserId = (userId: unknown): string => {
  if (typeof userId !== 'string' || !userId.trim()) {
    throw new GraphQLError('Missing or invalid userId claim', {
      extensions: { code: 'INVALID_TOKEN_PAYLOAD' }
    });
  }
  return userId;
};

const handleUserLookupError = (err: unknown): never => {
  if (err instanceof Error && err.name === 'CastError') {
    throw new GraphQLError('Invalid user id format', {
      extensions: { code: 'INVALID_USER_ID' }
    });
  }
  throw new GraphQLError('User lookup failed', {
    extensions: { code: 'USER_LOOKUP_FAILED' }
  });
};

const findUserById = async (userId: string) => {
  try {
    return await User.findById(userId);
  } catch (err) {
    return handleUserLookupError(err);
  }
};

export const getUserFromToken = async (token: string) => {
  const decoded = await verifyToken(token);
  const userId = validateUserId(decoded.userId);
  const user = await findUserById(userId);
  
  if (!user) {
    throw new GraphQLError('User not found', {
      extensions: {
        code: 'USER_NOT_FOUND'
      }
    });
  }
  
  return user;
};

const validateAuthScheme = (scheme: string): void => {
  if (!/^Bearer$/i.test(scheme)) {
    throw new GraphQLError('Invalid auth scheme', {
      extensions: { code: 'INVALID_AUTH_SCHEME' }
    });
  }
};

const validateToken = (token: string): void => {
  if (!token) {
    throw new GraphQLError('Token is required', {
      extensions: { code: 'MISSING_TOKEN' }
    });
  }
};

export const extractTokenFromHeader = (authHeader?: string): string => {
  if (!authHeader) {
    throw new GraphQLError('Authorization header is required', {
      extensions: {
        code: 'MISSING_AUTH_HEADER'
      }
    });
  }
  
  const [scheme, raw] = authHeader.trim().split(/\s+/);
  validateAuthScheme(scheme);
  
  const token = (raw || '').trim();
  validateToken(token);
  
  return token;
};