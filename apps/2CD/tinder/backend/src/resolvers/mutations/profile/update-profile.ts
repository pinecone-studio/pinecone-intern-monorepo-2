import { GraphQLError } from 'graphql';
import { Profile } from '../../../models/profile';
import { UpdateProfileArgs } from 'src/types/profile';

export const updateProfile = async (_: unknown, { id, input }: UpdateProfileArgs) => {
  try {
    const updatedProfile = await Profile.findByIdAndUpdate(
      id,
      { $set: input },
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      throw new GraphQLError('Profile not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    return updatedProfile;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }

    throw new GraphQLError('Failed to update profile', {
      extensions: { code: 'INTERNAL_SERVER_ERROR' },
    });
  }
};
