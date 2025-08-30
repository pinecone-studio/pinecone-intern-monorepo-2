import { Schema, model, Model, models, Types } from 'mongoose';

export type CommentSchemaType = {
  author: Types.ObjectId;
  parentId: Types.ObjectId;
  parentType: 'Comment' | 'Post';
  comments: Types.ObjectId[];
  content: string;
  likes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
};

const CommentSchema = new Schema<CommentSchemaType>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    parentId: { type: Schema.Types.ObjectId, required: true },
    parentType: { type: String, enum: ['Comment', 'Post'], required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    content: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

export const Comment = (models.Comment as Model<CommentSchemaType>) || model<CommentSchemaType>('Comment', CommentSchema);
