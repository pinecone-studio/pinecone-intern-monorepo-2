import { Schema, model, Model, models, Types } from 'mongoose';

export type ReplySchemaType = {
  author: Types.ObjectId;
  parentId: Types.ObjectId;
  parentType: 'Comment' | 'Reply'; 
  replyId: Types.ObjectId[];
  likes: Types.ObjectId[];
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

const ReplySchema = new Schema<ReplySchemaType>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    parentId: { type: Schema.Types.ObjectId, required: true }, 
    parentType: { type: String, enum: ['Comment', 'Reply'], required: true },
    replyId: [{ type: Schema.Types.ObjectId, ref: 'Reply', default: [] }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Reply: Model<ReplySchemaType> = models.Reply || model<ReplySchemaType>('Reply', ReplySchema);
