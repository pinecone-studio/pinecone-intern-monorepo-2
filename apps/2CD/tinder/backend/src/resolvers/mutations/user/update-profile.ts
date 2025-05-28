import { AuthenticationError, UserInputError } from 'apollo-server-express';
import User from '../../../models/user';
import { Context } from '../../../types/context';

interface UpdateProfileInput {
  name?: string;
  bio?: string;
  profession?: string;
  education?: string;
  interests?: string[];
}

export const updateProfile = async (
  _: unknown,
  { input }: { input: UpdateProfileInput },
  { user }: Context
) => {
  if (!user) {
    throw new AuthenticationError('Not authenticated');
  }
  const currentUser = await User.findById((user as { _id: string })._id);
  if (!currentUser) {
    throw new UserInputError('User not found');
  }
  updateFields(currentUser, input);
  await currentUser.save();
  return currentUser;
};

import { Document } from 'mongoose';

type UserDoc = Document & {
  name?: string;
  bio?: string;
  profession?: string;
  education?: string;
  interests?: string[];
};

function updateFields(currentUser: UserDoc, input: UpdateProfileInput) {
  assignIfDefined(currentUser, 'name', input.name);
  assignIfDefined(currentUser, 'bio', input.bio);
  assignIfDefined(currentUser, 'profession', input.profession);
  assignIfDefined(currentUser, 'education', input.education);
  assignIfDefined(currentUser, 'interests', input.interests);
}

function assignIfDefined<T, K extends keyof T>(obj: T, key: K, value: T[K] | undefined) {
  if (typeof value !== 'undefined') {
    Object.defineProperty(obj, key, { value, writable: true, configurable: true, enumerable: true });
  }
}