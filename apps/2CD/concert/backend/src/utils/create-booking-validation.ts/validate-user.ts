import { userModel } from '../../models';

export const validateUser = async (userId: string) => {
  const user = await userModel.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
};