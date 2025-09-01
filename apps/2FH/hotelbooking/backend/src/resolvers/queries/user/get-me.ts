import { UserModel } from 'src/models';

import { Context } from 'src/types';

export const getMe = async (_: unknown, __: unknown, context: Context) => {
  const { user } = context;
  if (!user) {
    throw new Error('Not authenticated');
  }

  const me = await UserModel.findById(user._id).select('-password');
  if (!me) {
    throw new Error('User not found');
  }

  return me;
};
