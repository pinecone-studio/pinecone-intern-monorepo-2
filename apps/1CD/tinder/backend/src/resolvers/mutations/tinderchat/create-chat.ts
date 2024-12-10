import { GraphQLError } from 'graphql';
import { MutationResolvers } from '../../../generated';
import { Chatmodel } from '../../../models/tinderchat/chat.model';
import { Messagemodel } from '../../../models/tinderchat/message.model';

export const createChat: MutationResolvers['createChat'] = async (_, { input }) => {
  const { participants, content, senderId } = input;
  const chat = await Chatmodel.create({ participants });
  if (!chat) {
    throw new GraphQLError(`Could not create chat`);
  }
  try {
    const chatId = chat._id;
    const message = await Messagemodel.create({ content, senderId, chatId });
    return message;
  } catch (error) {
    throw new GraphQLError(`Error occurred while creating the chat or message: ${error}`);
  }
};
