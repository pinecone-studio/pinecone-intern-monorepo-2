import { QueryResolvers } from 'src/generated';
import { commentModel, CommentPopulatedType } from 'src/models/comment.model';

export const getComments: QueryResolvers['getComments'] = async (_: unknown, { postId }, { userId }) => {
  if (!userId) throw new Error('wrong in authorization');

  const postsComments = await commentModel.find({ postId }).populate<CommentPopulatedType>('commentedUser');

  return postsComments.sort((a, b) => {
    return b.createdAt.valueOf() - a.createdAt.valueOf();
  });
};
