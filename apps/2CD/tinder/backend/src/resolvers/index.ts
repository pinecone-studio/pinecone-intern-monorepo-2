import sendMessage from './mutations/message/send-message';
import getMessage from './queries/message/get-message';
import { getLikesFromUser } from './queries/like/get-likes-from-user';
import { getLikesToUser } from './queries/like/get-likes-to-user';
import { createLike } from './mutations/like/create-like';
import { registerUser } from './mutations/user/register-user';
import { updateUser } from './mutations/user/update-user';
import { login } from './mutations/user/login';
import { getMatchById } from './queries/match/get-match-by-id';
import { getMyMatches } from './queries/match/get-my-matches';

export const resolvers = {
  Mutation: {
    createLike,
    sendMessage,
    registerUser,
    updateUser,
    login,
  },
  Query: {
    getLikesFromUser,
    getLikesToUser,

getMessage,
        getMyMatches,
    getMatchById,
  },

};
