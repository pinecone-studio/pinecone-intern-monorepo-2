import { User } from "src/models";
import { GraphQLError } from "graphql";
import { ContextUser } from "src/types/context-user";
import { requireAuthentication, validateUserOwnership } from "src/utils/auth";

const findUserById = async (userId: string) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new GraphQLError('User not found', {
      extensions: { code: 'USER_NOT_FOUND' }
    });
  }
  
  return user;
};

const performUserDeletion = async (userId: string) => {
  const deletedUser = await User.findByIdAndDelete(userId);
  
  if (!deletedUser) {
    throw new GraphQLError('User not found', {
      extensions: { code: 'USER_NOT_FOUND' }
    });
  }
  
  return deletedUser.toObject();
};

export const deleteUser = async (
  _parent: unknown,
  { userId }: { userId: string },
  context: ContextUser
) => {
  try {
    const authenticatedUserId = requireAuthentication(context);
    
    // Check if user can only delete their own account shuu
    validateUserOwnership(authenticatedUserId, userId, 'delete this account');
    
    await findUserById(userId);
    
    const deletedUser = await performUserDeletion(userId);
    
    return {
      success: true,
      message: 'User deleted successfully',
      deletedUser
    };
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Failed to delete user', {
      extensions: { code: 'USER_DELETION_FAILED' }
    });
  }
};