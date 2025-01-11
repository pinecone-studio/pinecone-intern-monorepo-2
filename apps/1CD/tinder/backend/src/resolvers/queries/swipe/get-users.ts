import { swipeModel, userModel } from '../../../models';
import { QueryResolvers } from '../../../generated';
import { Context } from '../../../types';
import { GraphQLError } from 'graphql';
export const getUsers: QueryResolvers['getUsers'] = async (_, __, { userId }: Context) => {
  const user = await userModel.findById(userId);
  if (!user) throw new GraphQLError('User not found');

  const swipes = await swipeModel.find({ swiperUser: userId });
  const swipedUserIds: string[] = swipes.map((swipe) => swipe.swipedUser.toString()).filter((id): id is string => Boolean(id));
  const filter = { _id: { $nin: [userId, ...swipedUserIds] } };
  const attraction = user.attraction.toLowerCase();
  if (attraction === 'both') {
    const users = await userModel.find(filter);
    return users;
  }

  const users = await userModel.find({
    ...filter,
    gender: attraction,
  });
  return users;
};
