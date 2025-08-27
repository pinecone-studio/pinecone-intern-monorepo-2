import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { FollowRequest, FollowRequestStatus } from 'src/models';

export const rejectFollowRequest = async (_: any, { requestId }: { requestId: string }, context: any) => {
  const currentUserId = context.userId;
  if (!currentUserId) {
    throw new AuthenticationError('Та нэвтэрсэн байх шаардлагатай.');
  }

  const request = await FollowRequest.findById(requestId);
  if (!request) {
    throw new UserInputError('Follow хүсэлт олдсонгүй.');
  }

  if (request.receiverId.toString() !== currentUserId) {
    throw new AuthenticationError('Танд энэ хүсэлтийг татгалзах эрх байхгүй.');
  }

  request.status = FollowRequestStatus.REJECTED;
  await request.save();

  return {
    success: true,
    message: 'Follow хүсэлтийг татгалзлаа.',
  };
};
