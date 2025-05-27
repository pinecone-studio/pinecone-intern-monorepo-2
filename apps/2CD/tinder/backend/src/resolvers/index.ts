
import { updateProfile } from './mutations/update-profile';
import { getMatchById, getMyMatches } from './queries/match';

export const resolvers = {
  Mutation: {
    updateProfile,
  },
  Query: {
    getMyMatches,
    getMatchById,
  },
};
