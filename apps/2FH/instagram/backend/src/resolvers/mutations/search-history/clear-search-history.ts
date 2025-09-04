import { GraphQLError } from 'graphql';
import { User } from 'src/models';

export const clearSearchHistory = async (_: unknown, __: unknown, context: { userId: string }) => {
  if (!context.userId) {
    throw new GraphQLError('Authentication required');
  }

  const currentUser = await User.findById(context.userId);
  if (!currentUser) {
    throw new GraphQLError('Current user not found');
  }

  currentUser.searchHistory = [];
  await currentUser.save();

  return {
    success: true,
    message: 'Search history cleared successfully'
  };
};