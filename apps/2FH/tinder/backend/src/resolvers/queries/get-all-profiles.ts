// src/queries/getAllProfiles.ts
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
    if (isNaN(parsedDate.getTime())) return new Date(0).toISOString();
    return parsedDate.toISOString();
  } catch {
    return new Date(0).toISOString();
  }
};

const safeDateToISOString = (date: Date | string | null | undefined): string => {
  if (!date) return new Date(0).toISOString();
  if (date instanceof Date) return date.toISOString();
  if (typeof date === 'string') return parseStringDate(date);
  return new Date(0).toISOString();
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

export const formatWorkProfile = (profile: ProfileDocument) => ({
  profession: profile.profession || '',
  work: profile.work || '',
  images: profile.images || [],
  dateOfBirth: parseDateOfBirth(profile.dateOfBirth),
  createdAt: safeDateToISOString(profile.createdAt),
  updatedAt: safeDateToISOString(profile.updatedAt),
});

export const formatSingleProfile = (profile: ProfileDocument) => ({
  ...formatBasicProfile(profile),
  ...formatWorkProfile(profile),
  likes: [],
  matches: [],
});


export const fetchAllProfiles = async (): Promise<ProfileDocument[]> => {
  const profiles = await Profile.find({});
  return profiles as ProfileDocument[];
};

export const handleError = (error: unknown): never => {
  if (error instanceof GraphQLError) throw error;
  if (error instanceof Error) return handleErrorObject(error);
  throw new GraphQLError('Failed to fetch profiles', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
};

export const handleErrorObject = (error: Error): never => {
  const message = error.message;
  if (typeof message === 'string' && (message.includes('Database') || message.includes('connection'))) {
    throw new GraphQLError('Database error', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
  }
  throw new GraphQLError('Failed to fetch profiles', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
};

export const processGetAllProfilesRequest = async () => {
  const profiles = await fetchAllProfiles();
  return profiles.map(formatSingleProfile);
};

export const getAllProfiles: QueryResolvers['getAllProfiles'] = async (
  _parent, _args, _context: Context, _info
) => {
  try {
    return await processGetAllProfilesRequest();
  } catch (error: unknown) {
    return handleError(error);
  }
}; 