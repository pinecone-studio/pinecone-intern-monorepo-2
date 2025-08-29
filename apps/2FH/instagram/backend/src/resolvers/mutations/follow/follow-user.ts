import { UserInputError } from 'apollo-server-express';
import { FollowRequest, FollowRequestStatus, User } from 'src/models';

interface Context {
  userId: string;
}

interface FollowArgs {
  targetUserId: string;
}

// Private user follow
const handlePrivateFollow = async (targetUserId: string, currentUserId: string) => {
  const existingRequest = await FollowRequest.findOne({
    receiverId: targetUserId,
    requesterId: currentUserId,
    status: FollowRequestStatus.PENDING,
  });

  if (existingRequest) {
    throw new UserInputError('Та аль хэдийнэ follow хүсэлт илгээсэн байна.');
  }

  const request = await FollowRequest.create({
    receiverId: targetUserId,
    requesterId: currentUserId,
    status: FollowRequestStatus.PENDING,
  });

  return { success: true, message: 'Follow хүсэлт илгээгдлээ.', request };
};

// Public user follow
const handlePublicFollow = async (targetUserId: string, currentUserId: string) => {
  const targetUser = await User.findById(targetUserId);
  const currentUser = await User.findById(currentUserId);

  if (!targetUser || !currentUser) {
    throw new UserInputError('Хэрэглэгч олдсонгүй.');
  }

  // Давхар нэмэгдэхээс хамгаалж $addToSet ашиглах
  await User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } });
  await User.findByIdAndUpdate(currentUserId, { $addToSet: { followings: targetUserId } });

  return { success: true, message: 'Амжилттай дагалаа.' };
};

export const followUser = async (_: unknown, { targetUserId }: FollowArgs, context: Context) => {
  const currentUserId = context.userId;

  if (currentUserId === targetUserId) {
    throw new UserInputError('Өөрийгөө follow хийж болохгүй.');
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) throw new UserInputError('Хэрэглэгч олдсонгүй.');

  if (targetUser.isPrivate) {
    return handlePrivateFollow(targetUserId, currentUserId);
  }

  return handlePublicFollow(targetUserId, currentUserId);
};
