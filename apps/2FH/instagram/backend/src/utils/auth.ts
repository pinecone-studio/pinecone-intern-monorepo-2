// apps/2FH/instagram/backend/src/utils/auth.ts
import { GraphQLError } from "graphql";
import { Context} from "src/types/context";
import { User } from "src/models";

export const requireAuthentication = (context: Context): string => {
  if (!context.userId) {
    throw new GraphQLError('Authentication required. Please login to access this resource.', {
      extensions: { 
        code: 'UNAUTHORIZED',
        http: { status: 401 }
      }
    });
  }
  return context.userId;
};

export const getAuthenticatedUser = async (context: Context) => {
  const userId = requireAuthentication(context);
  
  const user = await User.findById(userId);
  if (!user) {
    throw new GraphQLError('Authenticated user not found', {
      extensions: { 
        code: 'USER_NOT_FOUND',
        http: { status: 404 }
      }
    });
  }
  
  return user;
};

export const validateUserOwnership = (
  authenticatedUserId: string, 
  targetUserId: string,
  action = 'perform this action'
) => {
  if (authenticatedUserId !== targetUserId) {
    throw new GraphQLError(`Forbidden: You can only ${action} on your own resources`, {
      extensions: { 
        code: 'FORBIDDEN',
        http: { status: 403 }
      }
    });
  }
};

export const getOptionalAuth = (context: Context): string | undefined => {
  return context.userId;
};

export const validateNotSelfAction = (
  currentUserId: string, 
  targetUserId: string, 
  action: string
) => {
  if (currentUserId === targetUserId) {
    throw new GraphQLError(`You cannot ${action} yourself`, {
      extensions: { 
        code: 'INVALID_ACTION',
        http: { status: 400 }
      }
    });
  }
};