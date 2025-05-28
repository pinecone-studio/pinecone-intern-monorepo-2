import { updateProfile } from './mutations/user/update-profile';
import sendMessage from './mutations/message/send-message';
import getMessage from './queries/message/get-message';
import { getLikesFromUser } from './queries/like/get-likes-from-user';
import { getLikesToUser } from './queries/like/get-likes-to-user';
import { createLike } from './mutations/like/create-like';

import { createUser } from './mutations/user/create-user';
import { login } from './mutations/user/login';
import { getUserById } from './mutations/user/get-user-by-id';
import { getAllUsers } from './mutations/user/get-all-users';
import { me } from './mutations/user/me';

export const resolvers = {
  Query: {
    me,
    getUserById,
    getAllUsers,
    getLikesFromUser,
    getLikesToUser,
    getMessage,
  },
  Mutation: {
    registerUser: createUser,
    login,
    updateProfile,
    createLike,
    sendMessage,
  },
};

export default resolvers;
