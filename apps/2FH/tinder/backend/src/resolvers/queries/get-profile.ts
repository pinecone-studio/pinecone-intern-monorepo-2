// src/queries/getProfile.ts
import { Types } from 'mongoose';
import { GraphQLError } from 'graphql';
import { Profile, ProfileType, Gender } from '../../models/profile-model';
import { QueryResolvers, Gender as GraphQLGender } from '../../generated';
import { Context } from '../../types';

interface ProfileDocument extends ProfileType {
  _id: Types.ObjectId;
}

// Helpers
export const mapGenderToGraphQL = (gender: Gender): GraphQLGender => {
  const map: Record<Gender, GraphQLGender> = {
    [Gender.MALE]: GraphQLGender.Male,
    [Gender.FEMALE]: GraphQLGender.Female,
    [Gender.BOTH]: GraphQLGender.Both,
  };
  if (!(gender in map)) {
    throw new GraphQLError('Invalid gender value', { extensions: { code: 'BAD_USER_INPUT' } });
  }
  return map[gender];
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

export const parseStringDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  try {
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) return '';
    return parsedDate.toISOString();
  } catch {
    return '';
  }
};

const handleDateInstance = (date: Date): string => {
  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
};

const safeDateToISOString = (date: Date | string | null | undefined): string => {
  if (!date) return new Date().toISOString();
  if (date instanceof Date) return handleDateInstance(date);
  if (typeof date === 'string') return parseStringDate(date);
  return new Date().toISOString();
};

export { safeDateToISOString };

export const formatBasicProfile = (profile: ProfileDocument) => ({
  id: profile._id.toHexString(),
  userId: profile.userId.toHexString(),
  name: profile.name || '',
  gender: mapGenderToGraphQL(profile.gender),
  interestedIn: mapGenderToGraphQL(profile.interestedIn),
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
  const profile = await Profile.findOne({ userId: new Types.ObjectId(userId) });
  if (!profile) throw new GraphQLError('Profile not found', { extensions: { code: 'NOT_FOUND' } });
  return profile as ProfileDocument;
};

const fetchLikesAndMatches = async (userId: string, profileLikes: Types.ObjectId[], profileMatches: Types.ObjectId[]) => {
  const likedProfiles = await Profile.find({
    userId: { $in: profileLikes, $ne: new Types.ObjectId(userId) }
  }) as ProfileDocument[];
  const matchedProfiles = await Profile.find({
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
 