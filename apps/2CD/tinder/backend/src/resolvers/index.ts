
import { createMatch } from './match/create-match';
import { updateProfile } from './mutations/update-profile';

export const resolvers = {
  Mutation: {
    updateProfile,
    createMatch
  },
  Query: {},
};
