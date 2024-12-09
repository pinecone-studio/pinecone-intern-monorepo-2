import { model, models, Schema, Types } from 'mongoose';
import { UserType } from './user.model';

export type CommentType = {
  _id: string;
  postId: string;
  commentText: string;
  commentedUser: Schema.Types.ObjectId;
  reply: string;
  commentIsLike: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
const commentSchema = new Schema<CommentType>({
  postId: { type: String, required: true, ref: 'Post' },
  commentText: { type: String, required: true },
  commentedUser: { type: Schema.Types.ObjectId, required: true, ref: 'userModel' },
  reply: { type: String, ref: 'commentReplyModel' },
  commentIsLike: { type: Schema.Types.ObjectId, ref: 'commentLikeModel' },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

export type CommentPopulatedType = CommentType & { commentedUser: UserType };
export const commentModel = models['commentModel'] || model('commentModel', commentSchema);
