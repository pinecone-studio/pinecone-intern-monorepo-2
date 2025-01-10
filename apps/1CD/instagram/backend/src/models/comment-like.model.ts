import { model, models, Schema } from 'mongoose';
import { UserType } from './user.model';

export type commentLikeType = {
  _id: string;
  comment: Schema.Types.ObjectId;
  isLike: boolean;
  likedUser: Schema.Types.ObjectId;
  createdAt: Date;
};

const commentLikeSchema = new Schema<commentLikeType>({
  comment: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'commentModel',
  },
  isLike: {
    type: Boolean,
    default: false,
  },
  likedUser: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'userModel',
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});
export type PopulatedType = Omit<commentLikeType, 'likedUser'> & {
  user: UserType;
};

export const commentLikeModel = models.commentLikeModel || model<commentLikeType>('commentLikeModel', commentLikeSchema);
