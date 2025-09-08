import { Comment } from 'src/models';

export const CommentResolvers = {
  Comment: {
    comments: async (parent: any) => {
      if (parent.comments && parent.comments.length > 0) {
        return await Comment.find({ _id: { $in: parent.comments } }).populate('likes', 'userName profileImage');
      }
      return [];
    },
    likes: async (parent: any) => {
      if (parent.likes && parent.likes.length > 0) {
        const { User } = await import('src/models');
        return await User.find({ _id: { $in: parent.likes } }).select('userName profileImage');
      }
      return [];
    }
  }
};
