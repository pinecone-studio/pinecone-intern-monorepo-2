import { GraphQLError } from 'graphql';
import { MutationResolvers } from '../../../generated';
import { Chatmodel } from '../../../models/tinderchat/chat.model';
import { Messagemodel } from '../../../models/tinderchat/message.model';
import { Context } from '../../../types';

export const createChat: MutationResolvers['createChat'] = async (_, { input },{userId}:Context) => {
  try {
    const user1 = userId
    const { user2, content} = input;
      const tinderChat = await Chatmodel.findOne({
        participants: { $all: [user1, user2] }});
      if (!tinderChat) {
        const chat = await Chatmodel.create({ participants:[user1, user2]});
        const chatId = chat._id;
        const message = await Messagemodel.create({ content, senderId:userId, chatId });
        return message;
      }
      const chatId = tinderChat._id;
      const message = await Messagemodel.create({ content, senderId:userId, chatId });
      return message;
    
    
  } catch (error) {
    throw new GraphQLError(`Error occurred while creating the chat or message: ${error}`);
  }
};
