import { UserModel } from 'src/models';
export const getUsers = async () => {
  try {
    const users = await UserModel.find({}).select('-password');
    if (!users) return [];

    return users;
  } catch (error) {
    throw new Error(`Error fetching users: ${error}`);
  }
};
