import { model, models, Schema } from 'mongoose';

export type commentLikeType = {
  _id: string;
  commentId: Schema.Types.ObjectId;
  isLiked: boolean;
  likedUser: Schema.Types.ObjectId;
  createdAt: Date;
};

const commentLikeSchema = new Schema<commentLikeType>({
  commentId: { type: Schema.Types.ObjectId, required: true, ref: 'commentModel' },
  isLiked: { type: Boolean, default: false },
  likedUser: { type: Schema.Types.ObjectId, required: true, ref: 'userModel' },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});
export const commentLikeModel = models['commentLiekModel'] || model('commentLikeModel', commentLikeSchema);
