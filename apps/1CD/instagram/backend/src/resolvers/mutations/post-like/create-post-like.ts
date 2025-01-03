import { MutationResolvers, NotificationType } from '../../../generated';
import { notificationModel, PostLikeModel, PostModel } from '../../../models';

export const createPostLike: MutationResolvers['createPostLike'] = async (_, { postId, isLike }, { userId }) => {
  if (!userId) throw new Error('Unauthorized');
  if (!isLike) throw new Error('Error create postlike');
  const createdPostLike = await PostLikeModel.create({ user: userId, post: postId, isLike });
  const likedPost = await PostModel.findOne({ _id: postId });
  await notificationModel.create({ otherUserId: userId, postId, notificationType: NotificationType.Postlike, currentUserId: likedPost.user });

  return createdPostLike;
};
