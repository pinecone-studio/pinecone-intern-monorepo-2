import { MutationResolvers } from '../../../generated';
import { userModel } from '../../../models';
export const updateAttraction: MutationResolvers['updateAttraction'] = async (_, { _id, attraction }) => {
  const user = await userModel.findById({ _id });
  if (!user) {
    throw new Error('not find user');
  }
  const oneUser = await userModel.findByIdAndUpdate(_id, { attraction }, { new: true });
  return oneUser;
};
