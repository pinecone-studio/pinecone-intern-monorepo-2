import { UserModel } from 'src/models';
export const getUsers = async () => {
  try {
    const users = await UserModel.find({}).select('-password');

    return users || [];
  } catch (error) {
    throw new Error(`Error fetching users: ${error}`);
  }
};
