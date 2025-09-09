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
  id: profile._id?.toHexString() || '',
  userId: profile.userId?.toHexString() || '',
  name: profile.name || '',
  gender: mapGenderToGraphQL(profile.gender || Gender.BOTH),
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

export const formatSingleProfile = (profile: ProfileDocument) => {
  try {
    console.log('Formatting profile:', profile._id);

    // Ensure all required fields have valid values
    if (!profile._id) {
      throw new Error('Profile missing _id');
    }
    if (!profile.userId) {
      throw new Error('Profile missing userId');
    }

    return {
      ...formatBasicProfile(profile),
      ...formatWorkProfile(profile),
      interestedIn: mapGenderToGraphQL(profile.interestedIn || Gender.BOTH),
      likes: [],
      matches: [],
    };
  } catch (error) {
    console.error('Error formatting profile:', error, 'Profile data:', profile);
    throw error;
  }
};


export const fetchAllProfiles = async (): Promise<ProfileDocument[]> => {
  try {
    console.log('Fetching all profiles from database...');
    const profiles = await Profile.find({});
    console.log('Found profiles:', profiles.length);
    console.log('Profile data sample:', profiles.length > 0 ? profiles[0] : 'No profiles found');
    return profiles as ProfileDocument[];
  } catch (error) {
    console.error('Database error in fetchAllProfiles:', error);
    throw error;
  }
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

export const processGetAllProfilesRequest = async (): Promise<any[]> => {
  try {
    const profiles = await fetchAllProfiles();
    console.log('Fetched profiles:', profiles.length);
    if (profiles.length === 0) {
      return [];
    }
    const formattedProfiles = profiles.map(formatSingleProfile);
    console.log('Formatted profiles count:', formattedProfiles.length);
    return formattedProfiles;
  } catch (error) {
    console.error('Error in processGetAllProfilesRequest:', error);
    throw error;
  }
};

export const getAllProfiles: QueryResolvers['getAllProfiles'] = async (
  _parent: any, _args: any, _context: Context, _info: any
) => {
  try {
    const profiles = await processGetAllProfilesRequest();
    // Ensure we always return an array, never null or undefined
    if (!Array.isArray(profiles)) {
      console.warn('processGetAllProfilesRequest returned non-array:', profiles);
      return [];
    }
    return profiles;
  } catch (error: unknown) {
    console.error('Error in getAllProfiles:', error);
    throw handleError(error);
  }
}; 