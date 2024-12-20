import { GraphQLError } from 'graphql';
import { QueryResolvers } from '../../generated';
import { Chatmodel, Matchmodel, userModel } from '../../models';
import { Context } from '../../types';

export const getMatch: QueryResolvers['getMatch'] = async (_, __, {userId}:Context) => {
  try {
    const matches = await Matchmodel.find({
      $or: [{ user1: userId }, { user2: userId }],
      matched: true,  
    });

    if (!matches || matches.length === 0) {
      throw new GraphQLError(`No matches found`);
    }

    const userIds = matches.reduce((acc: string[], match: any) => {
      if (match.user1.toString() !== userId) {
        acc.push(match.user1.toString());
      }
      if (match.user2.toString() !== userId) {
        acc.push(match.user2.toString());
      }
      return acc;
    }, []);
   

    const uniqueUserIds = Array.from(new Set(userIds));
    const users = await userModel.find({
      _id: { $in: uniqueUserIds },
    });
   
    const chats = await Chatmodel.find({
      participants: { $in: [userId] , $elemMatch: { $in: uniqueUserIds } }
  
    })
    const usersWithChatStatus = users.map(user => {
      const hasChatted = chats.some(chat => 
        chat.participants.includes(userId) && chat.participants.includes(user._id)
      );
      return {
        ...user.toObject(),
        hasChatted
      };
    });
    return usersWithChatStatus;


  } catch (error) {
    throw new GraphQLError(`Error occurred: ${error}`);
  }
};
