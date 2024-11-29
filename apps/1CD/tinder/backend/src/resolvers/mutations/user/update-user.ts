import { MutationResolvers } from '../../../generated';
import { userModel } from '../../../models';
export const updateUser: MutationResolvers['updateUser'] = async (_, { _id, name, bio, interests, profession, schoolWork }) => {
  const user = await userModel.findById({ _id });
  if (!user) {
    throw new Error('Could not find user');
  }
  const oneUser = await userModel.findByIdAndUpdate(_id, { name, bio, interests, profession, schoolWork }, { new: true });
  return oneUser;
};
