import { updateProfile } from './mutations/update-profile';
import sendMessage from './mutations/message/send-message';
import getMessage from './queries/message/get-message';
import { getLikesFromUser } from './queries/like/get-likes-from-user';
import { getLikesToUser } from './queries/like/get-likes-to-user';
import { createLike } from './mutations/like/create-like';

export const resolvers = {
  Mutation: {
    updateProfile,
    createLike,
    sendMessage,
  },
  Query: {
    getLikesFromUser,
    getLikesToUser,
getMessage,
  },
};
