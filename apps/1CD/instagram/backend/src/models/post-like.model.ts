import { Schema, model, models } from 'mongoose';
import { UserType } from './user.model';

export type PostLikeType = {
  _id: string;
  user: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
  isLike: boolean;
  createdAt: Date;
};

const PostLikeSchema = new Schema<PostLikeType>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'userModel',
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'PostModel',
    required: true,
  },
  isLike: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export type PostLikeUserPopulatedType = Omit<PostLikeType, 'user'> & {
  user: UserType;
};

export const PostLikeModel = models.PostLikeModel || model<PostLikeType>('PostLikeModel', PostLikeSchema);
