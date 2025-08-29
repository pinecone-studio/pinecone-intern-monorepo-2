// src/queries/getProfile.ts
import { Types } from 'mongoose';
import { GraphQLError } from 'graphql';
import { ProfileModel } from '../../models/profile-model';
import { QueryResolvers, Gender as GraphQLGender } from '../../generated';
import { Context } from '../../types';
import { IProfile } from '../../models/profile-model';

interface ProfileDocument extends IProfile {
  _id: Types.ObjectId;
}

// Helpers
export const mapGenderToGraphQL = (gender: 'MALE' | 'FEMALE' | 'BOTH'): GraphQLGender => {
  const map: Record<'MALE' | 'FEMALE' | 'BOTH', GraphQLGender> = {
    'MALE': GraphQLGender.Male,
    'FEMALE': GraphQLGender.Female,
    'BOTH': GraphQLGender.Both,
  };
  return map[gender] || GraphQLGender.Male;
};

export const parseDateOfBirth = (dob?: string | null) => {
  if (!dob) return '';
  try {
    const date = new Date(dob);
    if (isNaN(date.getTime())) return '';
    return date.toISOString();
  } catch {
    return '';
  }
};

export const parseStringDate = (dateString: string): string => {
  try {
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) return new Date().toISOString();
    return parsedDate.toISOString();
  } catch {
    return new Date().toISOString();
  }
};

const safeDateToISOString = (date: Date | string | null | undefined): string => {
  if (!date) return new Date().toISOString();
  if (date instanceof Date) return date.toISOString();
  if (typeof date === 'string') return parseStringDate(date);
  return new Date().toISOString();
};

export { safeDateToISOString };

export const formatBasicProfile = (profile: ProfileDocument) => ({
  id: profile._id.toHexString(),
  userId: profile.userId.toHexString(),
  name: profile.name || '',
  gender: mapGenderToGraphQL(profile.gender),
  bio: profile.bio || '',
  interests: profile.interests || [],
});

const formatWorkProfile = (profile: ProfileDocument) => ({
  profession: profile.profession || '',
  work: profile.work || '',
  images: profile.images || [],
  dateOfBirth: parseDateOfBirth(profile.dateOfBirth),
  createdAt: safeDateToISOString(profile.createdAt),
  updatedAt: safeDateToISOString(profile.updatedAt),
});

const formatSingleProfile = (profile: ProfileDocument) => ({
  ...formatBasicProfile(profile),
  ...formatWorkProfile(profile),
  likes: [],
  matches: [],
});

const formatProfile = (profile: ProfileDocument, likedProfiles: ProfileDocument[], matchedProfiles: ProfileDocument[]) => ({
  ...formatSingleProfile(profile),
  likes: likedProfiles.map(formatSingleProfile),
  matches: matchedProfiles.map(formatSingleProfile),
});

const validateUserId = (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new GraphQLError('Invalid userId format', { extensions: { code: 'BAD_USER_INPUT' } });
  }
};

const fetchProfileData = async (userId: string): Promise<ProfileDocument> => {
  const profile = await ProfileModel.findOne({ userId: new Types.ObjectId(userId) });
  if (!profile) throw new GraphQLError('Profile not found', { extensions: { code: 'NOT_FOUND' } });
  return profile as ProfileDocument;
};

const fetchLikesAndMatches = async (userId: string, profileLikes: Types.ObjectId[], profileMatches: Types.ObjectId[]) => {
  const likedProfiles = await ProfileModel.find({
    userId: { $in: profileLikes, $ne: new Types.ObjectId(userId) }
  }) as ProfileDocument[];
  const matchedProfiles = await ProfileModel.find({
    userId: { $in: profileMatches, $ne: new Types.ObjectId(userId) }
  }) as ProfileDocument[];
  return { likedProfiles, matchedProfiles };
};

const handleError = (error: unknown): never => {
  if (error instanceof GraphQLError) throw error;
  if (error instanceof Error) return handleErrorObject(error);
  throw new GraphQLError('Failed to fetch profile', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
};

const handleErrorObject = (error: Error): never => {
  const message = error.message;
  if (typeof message === 'string' && (message.includes('Database') || message.includes('connection'))) {
    throw new GraphQLError('Database error', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
  }
  throw new GraphQLError('Failed to fetch profile', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
};

const processProfileRequest = async (userId: string) => {
  const profile = await fetchProfileData(userId);
  const { likedProfiles, matchedProfiles } = await fetchLikesAndMatches(userId, profile.likes, profile.matches);
  return formatProfile(profile, likedProfiles, matchedProfiles);
};

export const getProfile: QueryResolvers['getProfile'] = async (
  _parent, { userId }, _context: Context, _info
) => {
  try {
    validateUserId(userId);
    return await processProfileRequest(userId);
  } catch (error: unknown) {
    return handleError(error);
  }
};
