import { GraphQLError } from 'graphql';
import { User } from 'src/models';

export const removeFromSearchHistory = async (
  _: unknown, 
  { searchedUserId }: { searchedUserId: string }, 
  context: { userId: string }
) => {
  if (!context.userId) {
    throw new GraphQLError('Authentication required');
  }

  const currentUser = await User.findById(context.userId);
  if (!currentUser) {
    throw new GraphQLError('Current user not found');
  }

  // Remove from searchHistory
  currentUser.searchHistory = currentUser.searchHistory.filter(
    id => id.toString() !== searchedUserId
  );

  await currentUser.save();

  // Return updated user
  const updatedUser = await User.findById(context.userId)
    .populate({
      path: 'searchHistory',
      select: '_id fullName userName profileImage isVerified'
    });

  return updatedUser;
};