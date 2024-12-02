import { MutationResolvers } from '../../../generated';
import { userModel } from 'src/models';

export const deleteUser: MutationResolvers['deleteUser'] = async (_: unknown, { _id }) => {
  const deleteUserData = await userModel.findByIdAndDelete(_id);
  if (!deleteUserData) {
    throw new Error('Could not delete user');
  }
  return deleteUserData;
};
