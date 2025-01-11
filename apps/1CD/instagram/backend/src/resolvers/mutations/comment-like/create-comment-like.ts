import { commentLikeModel } from 'src/models';
import { MutationResolvers } from '../../../generated';

export const createCommentLike: MutationResolvers['createCommentLike'] = async (_, { commentId, isLike }, { userId }) => {
  if (!userId) throw new Error('Unauthorized');
  if (!isLike) throw new Error('Error create postlike');
  const createdCommentLike = await commentLikeModel.create({ likedUser: userId, comment: commentId, isLike });

  // const likedComment = await commentModel.findOne({ _id: commentId });
  // await notificationModel.create({ otherUserId: userId, commentId, notificationType: NotificationType.Commentlike, currentUserId: likedComment.user });

  return createdCommentLike;
};
