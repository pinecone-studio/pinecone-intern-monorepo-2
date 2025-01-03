import { MutationResolvers } from '../../../generated';
import { userModel } from '../../../models';
import { Context } from '../../../types';

export const editProfile: MutationResolvers['editProfile'] = async (_, { input }, { userId }: Context) => {
  const { name, email, bio, age, interests, photos, profession, schoolWork, attraction } = input;
  console.log(userId);

  const profileEdited = await userModel.findOneAndUpdate(
    { _id: userId },
    {
      name,
      email,
      bio,
      age,
      interests,
      photos,
      profession,
      schoolWork,
      attraction,
    }
  );

  if (!profileEdited) throw new Error('Could not find user');

  return profileEdited;
};
