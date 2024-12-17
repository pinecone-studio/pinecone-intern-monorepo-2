import { GraphQLError } from 'graphql';
import { QueryResolvers } from '../../generated';
import { Matchmodel } from '../../models/tinderchat/match.model';
import { userModel } from '../../models';

export const getMatch: QueryResolvers['getMatch'] = async (_, { input }) => {
  const userId = input._id;
  try {
    const matches = await Matchmodel.find({
      $or: [{ user1: userId }, { user2: userId }],matched: true
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
    return users;
  } catch (error) {
    throw new GraphQLError(`Error occured:${error}`);
  }
};
