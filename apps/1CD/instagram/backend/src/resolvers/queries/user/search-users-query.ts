import { QueryResolvers } from 'src/generated';
import { userModel } from 'src/models';

export const searchUsers: QueryResolvers['searchUsers'] = async (_, args, { userId }) => {
  if (!userId) throw new Error('Unauthorized');
  const { searchTerm } = args;

  if (!searchTerm) {
    throw new Error('Search term is required.');
  }

  const users = await userModel.find({
    $or: [{ userName: { $regex: searchTerm, $options: 'i' } }, { fullName: { $regex: searchTerm, $options: 'i' } }],
  });

  return users;
};
