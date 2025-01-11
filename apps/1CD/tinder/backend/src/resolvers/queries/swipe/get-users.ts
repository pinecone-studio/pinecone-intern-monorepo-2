import { swipeModel, userModel } from '../../../models';
import { QueryResolvers } from '../../../generated';
import { Context } from '../../../types';
import { GraphQLError } from 'graphql';

export const getUsers: QueryResolvers['getUsers'] = async (_, __, { userId }: Context) => {
  const user = await userModel.findById(userId);
  if (!user) throw new GraphQLError('User not found');

  const swipes = await swipeModel.find({ swiperUser: userId });

  const swipedUserIds: string[] = swipes.map((swipe) => swipe.swipedUser);

  const filter = { _id: { $nin: [userId, ...swipedUserIds] } };

  if (user.attraction === 'both') {
    const users = await userModel.find(filter);
    console.log(users, 'filteredUsers (both)');
    return users;
  }

  const attraction = user.attraction.toLowerCase();
  const users = await userModel.find({
    ...filter,
    gender: { $regex: new RegExp(`^${attraction}$`, 'i') },
  });

  return users;
};
