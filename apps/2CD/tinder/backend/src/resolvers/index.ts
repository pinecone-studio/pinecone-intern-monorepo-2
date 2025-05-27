
import { updateProfile } from './mutations/update-profile';
import { getLikesFromUser } from './queries/like/get-likes-from-user';
import { getLikesToUser } from './queries/like/get-likes-to-user';
import { createLike } from './mutations/like/create-like';

export const resolvers = {
  Mutation: {
    updateProfile,
    createLike,
  },
  Query: {
    getLikesFromUser,
    getLikesToUser,
  },
};
