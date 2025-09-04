import { GraphQLError } from 'graphql';
import { User } from 'src/models';

const validateAccess = (context: { userId: string }, userId: string): void => {
  const authorId = context.userId;

  if (!authorId) {
    throw new GraphQLError('Authentication required');
  }
  
  if (authorId !== userId) {
    throw new GraphQLError('Access denied');
  }
};

export const getUserSearchHistory = async (
  _: unknown, 
  { userId }: { userId: string }, 
  context: { userId: string }
) => {
  validateAccess(context, userId);

  const user = await User.findById(userId)
    .populate({
      path: 'searchHistory',
      select: '_id fullName userName profileImage isVerified',
      options: { limit: 20 } 
    });

  if (!user) {
    throw new GraphQLError('User not found');
  }

  return [...user.searchHistory].reverse();
};