import { GraphQLError } from 'graphql';
import { User } from 'src/models';

const validateSearchInput = (context: { userId: string }, keyword: string): string | null => {
  if (!context.userId) {
    throw new GraphQLError('Authentication required');
  }

  if (!keyword || keyword.trim().length === 0) {
    return null;
  }

  return keyword.trim();
};

export const searchUsers = async (
  _: unknown, 
  { keyword }: { keyword: string }, 
  context: { userId: string }
) => {
  const trimmedKeyword = validateSearchInput(context, keyword);
  
  if (!trimmedKeyword) {
    return [];
  }

  const users = await User.find({
    $and: [
      {
        $or: [
          { userName: { $regex: trimmedKeyword, $options: 'i' } },
          { fullName: { $regex: trimmedKeyword, $options: 'i' } }
        ]
      },
      { _id: { $ne: context.userId } } // Exclude self from search results
    ]
  })
    .select('_id fullName userName profileImage isVerified')
    .limit(20)
    .lean();

  return users;
};