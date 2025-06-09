import { User, UserRole } from 'src/models/user';
import { GraphQLError } from 'graphql';

export const updateUserRoleToAdmin = async (
  _: unknown,
  { userId }: { userId: string }
) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new GraphQLError('User not found', {
      extensions: { code: 'NOT_FOUND' }
    });
  }

  user.role = UserRole.ADMIN;
  await user.save();

  return {
    _id: user._id.toString(),
    email: user.email,
    role: user.role
  };
};