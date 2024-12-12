import { Schema, model, models } from 'mongoose';
import { UserType } from './user.model';

export type FollowType = {
  _id: string;
  followerId: Schema.Types.ObjectId;
  followingId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  status: string;
};

const followSchema = new Schema<FollowType>({
  followerId: {
    type: Schema.Types.ObjectId,
    ref: 'userModel',
    required: true,
  },
  followingId: {
    type: Schema.Types.ObjectId,
    ref: 'userModel',
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  status: {
    type: String,
    enum: ['APPROVED', 'PENDING'],
  },
});
export type FollowPopulatedType = Omit<FollowType, 'followingId'> & {
  followingId: UserType;
};
export type FollowerPopulatedType = Omit<FollowType, 'followerId'> & {
  followerId: UserType;
};
export const followModel = models['followModel'] || model('followModel', followSchema);
