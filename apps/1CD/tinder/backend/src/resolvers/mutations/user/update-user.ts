import { MutationResolvers } from '../../../generated';
import { userModel } from '../../../models';
import { Context } from '../../../types';
export const updateUser: MutationResolvers['updateUser'] = async (_, {name, bio, interests, profession, schoolWork },{userId}:Context, ) => {
  const oneUser = await userModel.findByIdAndUpdate({_id:userId}, { name, bio, interests, profession, schoolWork }, { new: true });
  return {email:oneUser.email};

};