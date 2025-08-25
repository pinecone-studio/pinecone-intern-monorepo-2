import { GraphQLError } from 'graphql';
import { HydratedDocument, Types } from 'mongoose';
import { User, UserSchemaType } from 'src/models/user';

interface GetUserByIdArgs {
  _id: string;
}

type UserDocument = HydratedDocument<UserSchemaType>;

const validateUserId = (userId: string): void => {
  if (!userId) {
    throw new GraphQLError('User ID is required');
  }

  if (!Types.ObjectId.isValid(userId)) {
    throw new GraphQLError('Invalid User ID');
  }
};

export const getUserById = async (_: unknown, { _id }: GetUserByIdArgs): Promise<UserDocument> => {
  validateUserId(_id);

  const user = await User.findById(_id).populate('followers', 'userName fullName profileImage isVerified').populate('followings', 'userName fullName profileImage isVerified');

  if (!user) {
    throw new GraphQLError('User not found');
  }
  return user;
};
