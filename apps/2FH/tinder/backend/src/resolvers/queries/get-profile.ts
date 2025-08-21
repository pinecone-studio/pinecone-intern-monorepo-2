// src/queries/getProfile.ts
import { Types } from 'mongoose';
import { GraphQLError } from 'graphql';
import { Profile as ProfileModel, Swipe as SwipeModel } from 'src/models';
import { QueryResolvers, Gender as GraphQLGender } from 'src/generated';
import { Context } from 'src/types';

// Helpers
const mapGenderToGraphQL = (gender: string): GraphQLGender => {
  const map: Record<string, GraphQLGender> = {
    male: GraphQLGender.Male,
    female: GraphQLGender.Female,
    both: GraphQLGender.Both,
  };
  const result = map[gender.toLowerCase()];
  if (!result) {
    throw new GraphQLError('Invalid gender value', { extensions: { code: 'BAD_USER_INPUT' } });
  }
  return result;
};

const parseDateOfBirth = (dob?: string | null) => dob ? new Date(dob).toISOString() : '';

const formatProfile = (profile: any, likes: any[], matches: any[]) => ({
  id: profile._id.toHexString(),
  userId: profile.userId.toHexString(),
  name: profile.name,
  gender: mapGenderToGraphQL(profile.gender),
  bio: profile.bio,
  interests: profile.interests,
  profession: profile.profession,
  work: profile.work,
  images: profile.images,
  dateOfBirth: parseDateOfBirth(profile.dateOfBirth),
  createdAt: profile.createdAt.toISOString(),
  updatedAt: profile.updatedAt.toISOString(),
  likes: likes.map(s => (s.targetId as any)._id.toHexString()),
  matches: matches.map(match => match.userId.toHexString()),
});

// Helper functions
const validateUserId = (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new GraphQLError('Invalid userId format', { extensions: { code: 'BAD_USER_INPUT' } });
  }
};

const fetchProfileData = async (userId: string) => {
  const profile = await ProfileModel.findOne({ userId: new Types.ObjectId(userId) });
  if (!profile) throw new GraphQLError('Profile not found', { extensions: { code: 'NOT_FOUND' } });
  return profile;
};

const fetchLikesAndMatches = async (userId: string, profileMatches: Types.ObjectId[]) => {
  const likes = await SwipeModel.find({ swiperId: userId }).populate('targetId', 'userId');
  const matches = await ProfileModel.find({ 
    userId: { $in: profileMatches } 
  }).select('userId name images profession');
  return { likes, matches };
};

const handleError = (error: unknown): never => {
  if (error instanceof GraphQLError) {
    throw error;
  }
  if (error instanceof Error && error.message.includes('Database')) {
    throw new GraphQLError('Database error', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
  }
  throw new GraphQLError('Failed to fetch profile', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
};

// Resolver
export const getProfile: QueryResolvers['getProfile'] = async (
  _parent,
  { userId },
  _context: Context
) => {
  try {
    validateUserId(userId);
    const profile = await fetchProfileData(userId);
    const { likes, matches } = await fetchLikesAndMatches(userId, profile.matches);
    return formatProfile(profile, likes, matches);
  } catch (error: unknown) {
    return handleError(error);
  }
};
