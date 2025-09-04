import { getAllProfiles } from './queries';
import { getProfile } from './queries/get-profile';

import { updateProfile } from './mutations/update-profile';

import { login } from './mutations/login';
import { createUser } from './mutations/create-user';
import { createProfile } from './mutations/create-profile-mutation';
import { swipe } from './mutations/swipe-mutation';

export const resolvers = {
  Query: {
    getAllProfiles,
    getProfile,
  },
  Mutation: {
    createProfile,
    updateProfile,

    login,
    createUser,
    swipe,
  },
};
