import { GraphQLError } from 'graphql';
import { User } from 'src/models';

const validateUser = (context: { userId: string }, searchedUserId: string): void => {
  if (!context.userId) {
    throw new GraphQLError('Authentication required');
  }

  if (context.userId === searchedUserId) {
    throw new GraphQLError('Cannot add yourself to search history');
  }
};

const findUsers = async (searchedUserId: string, currentUserId: string) => {
  const [searchedUser, currentUser] = await Promise.all([
    User.findById(searchedUserId),
    User.findById(currentUserId)
  ]);

  if (!searchedUser) {
    throw new GraphQLError('Searched user not found');
  }

  if (!currentUser) {
    throw new GraphQLError('Current user not found');
  }

  return { searchedUser, currentUser };
};

const updateSearchHistory = (currentUser: any, searchedUserId: string): void => {
  const existingIndex = currentUser.searchHistory.findIndex(
    (id: any) => id.toString() === searchedUserId
  );

  if (existingIndex !== -1) {
    currentUser.searchHistory.splice(existingIndex, 1);
  }

  currentUser.searchHistory.unshift(searchedUserId);

  if (currentUser.searchHistory.length > 50) {
    currentUser.searchHistory = currentUser.searchHistory.slice(0, 50);
  }
};

export const addToSearchHistory = async (
  _: unknown, 
  { searchedUserId }: { searchedUserId: string }, 
  context: { userId: string }
) => {
  validateUser(context, searchedUserId);
  
  const { currentUser } = await findUsers(searchedUserId, context.userId);
  
  updateSearchHistory(currentUser, searchedUserId);
  
  await currentUser.save();

  const updatedUser = await User.findById(context.userId)
    .populate({
      path: 'searchHistory',
      select: '_id fullName userName profileImage isVerified'
    });

  return updatedUser;
};