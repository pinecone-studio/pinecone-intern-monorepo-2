import { Schema, model, models } from 'mongoose';

export type Reply = {
  _id: string;
  userID: Schema.Types.ObjectId;
  commentID: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

const ReplySchema = new Schema<Reply>({
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'userModel',
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

export const ReplyModel = models.Reply || model<Reply>('Reply', ReplySchema);
