import { MutationResolvers } from '../../../generated';
import { userModel } from '../../../models';
import { Context } from '../../../types';
export const updateGender: MutationResolvers['updateGender'] = async (_, {gender},{userId}:Context) => {
  if (!gender) throw new Error('Please enter or choose a gender.');
  const oneUser = await userModel.findOneAndUpdate({ _id:userId}, { gender });
  return { email: oneUser.email};
};