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

const parseDateOfBirth = (dob?: string | null) => {
  if (!dob) {
    // Return empty string when dateOfBirth is null/undefined
    return '';
  }
  return new Date(dob).toISOString();
};

const formatProfile = (profile: any, likes: any[], matches: any[]) => ({
  id: profile._id.toHexString(),
  userId: profile.userId.toHexString(),
  name: profile.name,
  gender: mapGenderToGraphQL(profile.gender),
  interestedIn: mapGenderToGraphQL(profile.interestedIn),
  bio: profile.bio,
  interests: profile.interests,
  profession: profile.profession,
  work: profile.work,
  images: profile.images,
  dateOfBirth: parseDateOfBirth(profile.dateOfBirth),
  createdAt: profile.createdAt.toISOString(),
  updatedAt: profile.updatedAt.toISOString(),
  likes: likes.map(s => s.targetId.toHexString()),
  matches: matches.map(match => ({
    id: match._id.toHexString(),
    userId: match.userId.toHexString(),
    name: match.name,
    images: match.images,
    bio: match.bio,
    interests: match.interests,
    profession: match.profession,
    work: match.work,
    dateOfBirth: parseDateOfBirth(match.dateOfBirth),
  })),
});

// Helper functions
const validateUserId = (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new GraphQLError('Invalid userId format', { extensions: { code: 'BAD_USER_INPUT' } });
  }
};

const fetchProfileData = async (userId: string) => {
  console.log('Fetching profile for userId:', userId);
  const profile = await ProfileModel.findOne({ userId: new Types.ObjectId(userId) });
  if (!profile) {
    console.log('Profile not found for userId:', userId);
    throw new GraphQLError('Profile not found', { extensions: { code: 'NOT_FOUND' } });
  }
  console.log('Profile found:', profile._id);
  return profile;
};

const fetchLikesAndMatches = async (userId: string, profileMatches: Types.ObjectId[]) => {
  const userIdObj = new Types.ObjectId(userId);
  console.log('Fetching likes for userId:', userId);
  const likes = await SwipeModel.find({ swiperId: userIdObj });
  console.log('Found likes:', likes.length);

  console.log('Fetching matches for profileMatches:', profileMatches);
  const matches = await ProfileModel.find({
    userId: { $in: profileMatches }
  }); // Remove .select() to get all fields
  console.log('Found matches:', matches.length);
  return { likes, matches };
};

const handleError = (error: unknown): never => {
  console.error('Error in getProfile resolver:', error);
  if (error instanceof GraphQLError) {
    throw error;
  }
  if (error instanceof Error && error.message.includes('Database')) {
    throw new GraphQLError('Database error', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
  }
  if (error instanceof Error) {
    console.error('Error details:', error.message, error.stack);
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
    console.log('getProfile called with userId:', userId);
    validateUserId(userId);
    const profile = await fetchProfileData(userId);
    const { likes, matches } = await fetchLikesAndMatches(userId, profile.matches);
    const result = formatProfile(profile, likes, matches);
    console.log('getProfile returning result for userId:', userId);
    return result;
  } catch (error: unknown) {
    return handleError(error);
  }
};
