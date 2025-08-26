import { GraphQLError } from 'graphql';
import { HydratedDocument } from 'mongoose';
import { User, UserSchemaType } from 'src/models';

interface GetUserByUsernameArgs {
  userName: string;
}

type UserDocument = HydratedDocument<UserSchemaType>;

const validateUsername = (userName: string): void => {
  if (!userName) {
    throw new GraphQLError('Username is required');
  }
};

export const getUserByUsername = async (_: unknown, { userName }: GetUserByUsernameArgs): Promise<UserDocument> => {
  validateUsername(userName);

  const user = await User.findOne({ userName })
    .populate('followers', 'userName fullName profileImage isVerified')
    .populate('followings', 'userName fullName profileImage isVerified')
    .populate('stories')
    .populate('posts');

  if (!user) {
    throw new GraphQLError('User not found');
  }

  return user;
};
