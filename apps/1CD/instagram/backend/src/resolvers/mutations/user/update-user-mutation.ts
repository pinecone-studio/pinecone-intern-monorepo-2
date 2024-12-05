import { MutationResolvers } from '../../../generated';
import { userModel } from '../../../models/user.model';

export const updateUserData: MutationResolvers['updateUserData'] = async (_: unknown, { input }) => {
  const updateData = await userModel.findByIdAndUpdate(
    input._id,
    {
      userName: input.userName,
      fullName: input.fullName,
      bio: input.bio,
      gender: input.gender,
      profileImg: input.profileImg,
      accountVisibility: input.accountVisibility,
    },
    { new: true }
  );
  if (!updateData) {
    throw new Error('Could not update user data');
  }
  return updateData;
};
