import { getAllProfiles } from './queries/get-all-profiles';
import { getProfile } from './queries/get-profile';
import { updateProfile } from './mutations/update-profile';
import { login } from './mutations/login';
import { createUser } from './mutations/create-user';

export const resolvers = {
  Query: {
    getAllProfiles,
    getProfile,
  },
  Mutation: {
    updateProfile,
    login,
    createUser,
  },
};
