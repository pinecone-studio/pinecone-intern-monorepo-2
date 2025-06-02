import { User } from 'src/models/user';
import { IUser } from 'src/models/user';

export const getAllUsers = async (): Promise<IUser[]> => {
  return await User.find();
};