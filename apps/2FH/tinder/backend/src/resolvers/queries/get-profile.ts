
import { Types } from 'mongoose';
import { QueryResolvers, Gender, Profile as GeneratedProfile } from 'src/generated';
import { Profile as ProfileModel } from 'src/models';
import { GraphQLError } from 'graphql';

interface ProfileDocument {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  gender: string;
  bio: string;
  interests: string[];
  profession: string;
  work: string;
  images: string[];
  dateOfBirth: Date;
  createdAt: Date;
  updatedAt: Date;
}

const mapGender = (gender: string): Gender => {
  const mappedGender = { male: Gender.Male, female: Gender.Female, both: Gender.Both }[gender];
  if (!mappedGender) throw new GraphQLError('Invalid gender value', { extensions: { code: 'BAD_USER_INPUT' } });
  return mappedGender;
};

const mapProfileData = (profile: ProfileDocument): GeneratedProfile => ({
  id: profile._id.toHexString(),
  userId: profile.userId.toHexString(),
  name: profile.name,
  gender: mapGender(profile.gender),
  bio: profile.bio,
  interests: profile.interests,
  profession: profile.profession,
  work: profile.work,
  images: profile.images,
  dateOfBirth: profile.dateOfBirth.toISOString(),
  createdAt: profile.createdAt.toISOString(),
  updatedAt: profile.updatedAt.toISOString(),
  likes: [],
  matches: [],
});

const validateUserId = (userId: string): void => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new GraphQLError('Invalid userId format', { extensions: { code: 'BAD_USER_INPUT' } });
  }
};

const findProfile = async (userId: string): Promise<ProfileDocument> => {
  const profile = await ProfileModel.findOne({ userId: new Types.ObjectId(userId) });
  if (!profile) {
    throw new GraphQLError('Profile not found', { extensions: { code: 'NOT_FOUND', http: { status: 404 } } });
  }
  return profile as unknown as ProfileDocument;
};

const handleError = (error: unknown): never => {
  console.error('Error in getProfile:', error);
  if (error instanceof GraphQLError) {
    throw error;
  }
  throw new GraphQLError(error instanceof Error ? error.message : 'Failed to fetch profile', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
};

export const getProfile: QueryResolvers['getProfile'] = async (_, { userId }) => {
  try {
    validateUserId(userId);
    const profile = await findProfile(userId);
    return mapProfileData(profile);
  } catch (error) {
    return handleError(error);
  }
};