import { model, models, Schema } from 'mongoose';

export type CommentReplyType = {
  _id: string;
  commentId: Schema.Types.ObjectId;
  repliedUser: Schema.Types.ObjectId;
  replyText: string;
  createdAt: Date;
};
const commentReplySchema = new Schema<CommentReplyType>({
  commentId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'commentModel',
  },
  repliedUser: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'userModel',
  },
  replyText: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});
export const commentReplyModel = models['commentReplyModel'] || model('commentReplyModel', commentReplySchema);
