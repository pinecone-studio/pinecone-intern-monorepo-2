import { MutationResolvers } from '../../../generated';
import { userModel } from '../../../models';
import { Context } from '../../../types';

export const imageSubmit: MutationResolvers['imageSubmit'] = async (_, { input }, { userId }: Context) => {
  const { photos } = input;
  console.log(userId);

  const updateUser = await userModel.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        photos,
      },
    },
    { new: true }
  );

  if (!updateUser) throw new Error('Could not find user');

  return { photos: updateUser.photos, email: updateUser.email };
};
