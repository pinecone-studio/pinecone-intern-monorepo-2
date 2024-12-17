import { MutationResolvers } from '../../../generated';
import { userModel } from '../../../models';
import { Context } from '../../../types';
export const updateAttraction: MutationResolvers['updateAttraction'] = async (_, {  attraction },{userId}:Context) => {
  if (!attraction) throw new Error('Please enter or choose an attraction.');
  const oneUser = await userModel.findOneAndUpdate({ _id:userId}, { attraction });
  return { email: oneUser.email};
};
