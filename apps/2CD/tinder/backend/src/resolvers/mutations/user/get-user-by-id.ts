import User from '../../../models/user';
import { UserInputError } from 'apollo-server-express';

export const getUserById = async (_: unknown, { id }: { id: string }) => {
  if (!id) {
    throw new UserInputError('Хэрэглэгийн ID сонгоно уу');
  }
  const user = await User.findById(id);
  if (!user) {
    return null;
  }
  return user;
};
