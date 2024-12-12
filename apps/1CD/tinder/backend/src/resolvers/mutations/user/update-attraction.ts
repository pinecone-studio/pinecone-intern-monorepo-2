import { MutationResolvers } from '../../../generated';
import { userModel } from '../../../models';
export const updateAttraction: MutationResolvers['updateAttraction'] = async (_, { email, attraction }) => {
  if (!attraction) throw new Error('attraction is empty');
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new Error('user not found');
  }
  const oneUser = await userModel.findOneAndUpdate({ email }, { attraction });
  return { email: oneUser.email, attraction: oneUser.attraction };
};
