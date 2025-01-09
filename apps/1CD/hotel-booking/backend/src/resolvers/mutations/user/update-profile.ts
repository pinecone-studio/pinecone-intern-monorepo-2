import { MutationResolvers } from 'src/generated';
import { userModel } from 'src/models';

export const updateProfile: MutationResolvers['updateProfile'] = async (_, { input }, { userId }) => {
  if (!userId) throw new Error('Must login first');

  const user = await userModel.findByIdAndUpdate(userId, input, { new: true, runValidators: true });

  return user;
};
