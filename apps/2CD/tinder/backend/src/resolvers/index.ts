import { updateProfile } from './mutations/update-profile';
<<<<<<< HEAD
import { getMatchById, getMyMatches } from './queries/match';
import sendMessage from './mutations/message/send-message';
import getMessage from './queries/message/get-message';
import { getLikesFromUser } from './queries/like/get-likes-from-user';
import { getLikesToUser } from './queries/like/get-likes-to-user';
import { createLike } from './mutations/like/create-like';
=======
import { getMatchById } from './queries/match/get-match-by-id';
import { getMyMatches } from './queries/match/get-my-matches';

>>>>>>> eacd0a28 (feat: code structure fix)

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
        getMyMatches,
    getMatchById,
  },

};
