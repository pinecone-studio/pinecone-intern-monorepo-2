import { GraphQLError } from 'graphql';
import { CreateProfileArgs } from '../../../types/profile';
import { Profile } from '../../../models/profile';
import { Types } from 'mongoose';

const checkExistingProfile = async (userId: string): Promise<boolean> => {
  const existingProfile = await Profile.findOne({ userId: new Types.ObjectId(userId) });
  return !!existingProfile;
};

export const createProfile = async (_: unknown, { input }: CreateProfileArgs) => {
  try {
    const hasExistingProfile = await checkExistingProfile(input.userId);
    if (hasExistingProfile) {
      throw new GraphQLError('Энэ хэрэглэгчийн профайл үүссэн байна');
    }

    const profile = new Profile(input);
    await profile.save();
    return profile;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Профайл үүсгэхэд алдаа гарлаа', {
      extensions: { code: 'INTERNAL_SERVER_ERROR', originalError: error },
    });
  }
};
