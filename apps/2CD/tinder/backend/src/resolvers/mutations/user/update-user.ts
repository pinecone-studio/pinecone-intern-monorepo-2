import { GraphQLError } from 'graphql';
import User from '../../../models/user';
import { Context } from '../../../types/context';

interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
}

export const updateUser = async (_: unknown, { input }: { input: UpdateUserInput }, { user }: Context) => {
  if (!user) {
    throw new GraphQLError('Not authenticated', {
      extensions: { code: 'UNAUTHENTICATED' }
    });
  }

  const currentUser = await User.findById((user as { _id: string })._id);
  if (!currentUser) {
    throw new GraphQLError('Хэрэглэгч олдсонгүй', {
      extensions: { code: 'BAD_USER_INPUT' }
    });
  }

  updateFields(currentUser, input);
  await currentUser.save();

  return currentUser;
};

import { Document } from 'mongoose';

type UserDoc = Document & {
  name?: string;
  email?: string;
  password?: string;
};

function updateFields(currentUser: UserDoc, input: UpdateUserInput) {
  assignIfDefined(currentUser, 'name', input.name);
  assignIfDefined(currentUser, 'email', input.email);
  assignIfDefined(currentUser, 'password', input.password);
}

function assignIfDefined<T, K extends keyof T>(obj: T, key: K, value: T[K] | undefined) {
  if (typeof value !== 'undefined') {
    Object.defineProperty(obj, key, { value, writable: true, configurable: true, enumerable: true });
  }
}
