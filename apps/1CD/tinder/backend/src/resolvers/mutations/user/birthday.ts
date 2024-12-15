import { MutationResolvers } from '../../../generated';
import { userModel } from '../../../models';
import { Context } from '../../../types';

export const birthdaySubmit: MutationResolvers['birthdaySubmit'] = async (_, { input },{userId}:Context) => {
  const { age } = input;

  const updateUser = await userModel.findOneAndUpdate(
    { _id:userId},
    {
      $set: {
        age,
        updatedAt: new Date(),
      },
    },
  );

  if (!updateUser) throw new Error('Could not find user');

  return { email: updateUser.email };
};
