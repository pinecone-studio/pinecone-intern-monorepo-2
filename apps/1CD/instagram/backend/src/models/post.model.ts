import { Schema, model, models } from 'mongoose';

export type Post = {
  _id: string;
  user: string;
  description: string;
  images: string[];
  lastComments: string;
  commentCount: number;
  likeCount: number;
  updatedAt: Date;
  createdAt: Date;
};

const PostSchema = new Schema<Post>({
  user: {
    type: String,

    required: true,
  },

  description: {
    type: String,
  },

  images: [{ type: String, required: true }],

  lastComments: { type: String, },

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

export const PostModel = models.Post || model<Post>('Post', PostSchema);
