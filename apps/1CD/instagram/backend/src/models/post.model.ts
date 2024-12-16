import { Schema, Types, model, models } from 'mongoose';
import { UserType } from './user.model';

export type Post = {
  _id: string;
  user: Types.ObjectId;
  description: string;
  images: string[];
  lastComments: string[];
  commentCount: number;
  likeCount: number;
  updatedAt: Date;
  createdAt: Date;
};

const PostSchema = new Schema<Post>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'userModel',
    required: true,
  },

  description: {
    type: String,
  },

  images: [{ type: String, required: true }],

  lastComments: [{ type: String }],

  commentCount: {
    type: Number,
  },

  likeCount: {
    type: Number,
  },
  updatedAt: {
    type: Date,

    default: new Date(),
  },
  createdAt: {
    type: Date,

    default: new Date(),
  },
});

export type PostPopulatedType = Omit<Post, 'user'> & {
  user: UserType;
};

export const PostModel = models.Post || model<Post>('Post', PostSchema);
