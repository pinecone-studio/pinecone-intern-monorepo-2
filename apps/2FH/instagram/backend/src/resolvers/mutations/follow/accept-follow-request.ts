import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { Types } from 'mongoose';
import { FollowRequest, FollowRequestStatus, User } from 'src/models';

interface Context {
  userId?: string;
}

interface AcceptArgs {
  requesterId: string;
}

const findPendingRequest = async (receiverId: string, requesterId: string) => {
  const request = await FollowRequest.findOne({
    receiverId,
    requesterId,
    status: FollowRequestStatus.PENDING,
  });

  if (!request) {
    throw new UserInputError('Хүсэлт олдсонгүй эсвэл аль хэдийнэ шийдэгдсэн байна.');
  }
  return request;
};

const acceptRequest = async (receiverId: string, requesterId: string) => {
  await FollowRequest.updateOne({ receiverId, requesterId }, { status: FollowRequestStatus.ACCEPTED });
  const user = await User.findById(receiverId);
  if (user) {
    const requesterObjectId = new Types.ObjectId(requesterId);
    // Давхар нэмэгдэхээс хамгаалж $addToSet ашиглаж болно
    if (!user.followers.some((id) => id.equals(requesterObjectId))) {
      user.followers.push(requesterObjectId);
      await user.save();
    }
  }

  return { success: true, message: 'Follow хүсэлтийг зөвшөөрлөө.' };
};

export const acceptFollowRequest = async (_: unknown, { requesterId }: AcceptArgs, context: Context) => {
  const currentUserId = context.userId;
  if (!currentUserId) throw new AuthenticationError('Нэвтэрсэн байх шаардлагатай.');

  await findPendingRequest(currentUserId, requesterId);
  return acceptRequest(currentUserId, requesterId);
};
