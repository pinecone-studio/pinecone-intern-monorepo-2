import { UserInputError, AuthenticationError } from 'apollo-server-express';
import { User } from 'src/models';

interface Context {
  userId?: string;
}

interface UnfollowArgs {
  targetUserId: string;
}

const validateUnfollowRequest = (currentUserId: string, targetUserId: string) => {
  if (currentUserId === targetUserId) {
    throw new UserInputError('Өөрийгөө unfollow хийж болохгүй.');
  }
};

const validateUsersExist = async (targetUserId: string, currentUserId: string) => {
  const targetUser = await User.findById(targetUserId);
  const currentUser = await User.findById(currentUserId);

  if (!targetUser || !currentUser) {
    throw new UserInputError('Хэрэглэгч олдсонгүй.');
  }
};

const performUnfollow = async (targetUserId: string, currentUserId: string) => {
  await User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } });
  await User.findByIdAndUpdate(currentUserId, { $pull: { followings: targetUserId } });
};

export const unfollowUser = async (_: unknown, { targetUserId }: UnfollowArgs, context: Context) => {
  const currentUserId = context.userId;
  if (!currentUserId) throw new AuthenticationError('Нэвтэрсэн байх шаардлагатай.');

  validateUnfollowRequest(currentUserId, targetUserId);
  await validateUsersExist(targetUserId, currentUserId);
  await performUnfollow(targetUserId, currentUserId);

  return { success: true, message: 'Unfollow амжилттай боллоо.' };
};
