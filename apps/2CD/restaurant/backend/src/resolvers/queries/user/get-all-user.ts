import { User } from 'src/models/user.model';

export const getAllUser = async (_: unknown) => {
  const allUser = await User.find({});
  return allUser;
};
