import { GraphQLError } from 'graphql';
import { MutationResolvers } from '../../../generated';
import { Chatmodel } from '../../../models/tinderchat/chat.model';
import { Messagemodel } from '../../../models/tinderchat/message.model';

export const createChat: MutationResolvers['createChat'] = async (_, { input }) => {
  try {
    const { participants, content, senderId} = input;
      const [user1, user2] = participants
      const tinderChat = await Chatmodel.findOne({
        participants: { $all: [user1, user2] }});
      if (!tinderChat) {
        const chat = await Chatmodel.create({ participants });
        const chatId = chat._id;
        const message = await Messagemodel.create({ content, senderId, chatId });
        return message;
      }
      const chatId = tinderChat._id;
      const message = await Messagemodel.create({ content, senderId, chatId });
      return message;
    
    
  } catch (error) {
    throw new GraphQLError(`Error occurred while creating the chat or message: ${error}`);
  }
};
