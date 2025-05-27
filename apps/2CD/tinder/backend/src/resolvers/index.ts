import { updateProfile } from './mutations/update-profile';
import sendMessage from './mutations/message/send-message';
import getMessage from './queries/message/get-message';

export const resolvers = {
  Mutation: {
    updateProfile,
    sendMessage,
  },
  Query: {
    getMessage,
  },
};
