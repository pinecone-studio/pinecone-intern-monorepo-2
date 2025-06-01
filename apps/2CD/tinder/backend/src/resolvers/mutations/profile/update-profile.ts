import { GraphQLError } from 'graphql';
import { Profile } from '../../../models/profile';

interface UpdateProfileInput {
  bio?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  lookingFor?: 'Male' | 'Female' | 'Both';
  interests?: string[];
  profession?: string;
  education?: string;
  isCertified?: boolean;
  images?: string[];
}

interface UpdateProfileArgs {
  id: string;
  input: UpdateProfileInput;
}

export const updateProfile = async (_: unknown, { id, input }: UpdateProfileArgs) => {
  try {
    const profile = await Profile.findByIdAndUpdate(
      id,
      { $set: input },
      { new: true, runValidators: true }
    );

    if (!profile) {
      throw new GraphQLError('Profile not found', {
        extensions: { code: 'NOT_FOUND' }
      });
    }

    return profile;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Failed to update profile', {
      extensions: { code: 'INTERNAL_SERVER_ERROR' }
    });
  }
}; 