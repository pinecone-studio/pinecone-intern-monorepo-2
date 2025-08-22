/* eslint-disable complexity */

import { GraphQLError } from 'graphql';
import { Types } from 'mongoose';
import { EditProfile } from 'src/models/edit-profile';

type Gender = 'MALE' | 'FEMALE' | 'OTHER';

interface UpdateProfileInput {
  fullName?: string;
  userName?: string;
  bio?: string;
  gender?: Gender;
  profileImage?: string;
}

interface UpdateArgs {
  input: UpdateProfileInput;
}

interface Ctx {
  userId: string;
}

const USERNAME_REGEX = /^[a-z0-9._]{3,30}$/;
const RESERVED = new Set(['admin', 'root', 'api', 'support', 'login', 'signup']);

const requireAuth = (userId?: string): Types.ObjectId => {
  if (!userId) throw new GraphQLError('User is not authenticated');
  return new Types.ObjectId(userId);
};

const ensureHasUpdatableField = (input: UpdateProfileInput) => {
  if (input.fullName === undefined && input.userName === undefined && input.bio === undefined && input.gender === undefined && input.profileImage === undefined) {
    throw new GraphQLError('No fields to update');
  }
};

const normalizeAndValidate = async (userObjectId: Types.ObjectId, input: UpdateProfileInput): Promise<Record<string, any>> => {
  const $set: Record<string, any> = {};

  // fullName
  if (input.fullName !== undefined) {
    const name = input.fullName.trim();
    if (!name) throw new GraphQLError('Full name cannot be empty');
    if (name.length > 80) throw new GraphQLError('Full name must be ≤ 80 chars');
    $set.fullName = name;
  }

  // userName
  if (input.userName !== undefined) {
    const username = input.userName.trim().toLowerCase();
    if (!USERNAME_REGEX.test(username)) {
      throw new GraphQLError('Username must match /^[a-z0-9._]{3,30}$/');
    }
    if (RESERVED.has(username)) throw new GraphQLError('This username is reserved');

    const exists = await EditProfile.exists({ userName: username, _id: { $ne: userObjectId } });
    if (exists) throw new GraphQLError('Username already taken');
    $set.userName = username;
  }

  // bio
  if (input.bio !== undefined) {
    if (input.bio.length > 150) throw new GraphQLError('Bio must be ≤ 150 chars');
    $set.bio = input.bio;
  }

  // gender
  if (input.gender !== undefined) {
    const ok = input.gender === 'MALE' || input.gender === 'FEMALE' || input.gender === 'OTHER';
    if (!ok) throw new GraphQLError('Invalid gender value');
    $set.gender = input.gender;
  }

  // profileImage
  if (input.profileImage !== undefined) {
    const url = input.profileImage.trim();
    if (!url) throw new GraphQLError('Profile image URL cannot be empty');
    $set.profileImage = url;
  }

  return $set;
};

const loadUserOrThrow = async (userObjectId: Types.ObjectId) => {
  const user = await EditProfile.findById(userObjectId);
  if (!user) throw new GraphQLError('User not found');
  return user;
};

const applyUpdatesAndSave = async (user: any, updates: Record<string, any>) => {
  Object.assign(user, updates);
  await user.save();
  return user;
};

const rethrow = (error: unknown): never => {
  if ((error as any)?.code === 11000) {
    throw new GraphQLError('Username already taken');
  }
  if (error instanceof GraphQLError) throw error;
  throw new GraphQLError('Failed to update profile: ' + (error instanceof Error ? error.message : 'Unknown error'));
};

export const updateMyProfile = async (_parent: unknown, { input }: UpdateArgs, context: Ctx) => {
  try {
    const userObjectId = requireAuth(context.userId);
    ensureHasUpdatableField(input);
    const updates = await normalizeAndValidate(userObjectId, input);
    const user = await loadUserOrThrow(userObjectId);
    return await applyUpdatesAndSave(user, updates);
  } catch (e) {
    rethrow(e);
  }
};
