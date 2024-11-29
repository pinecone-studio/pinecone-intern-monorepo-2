import { Schema, model, models } from 'mongoose';

export type Reply = {
  _id: string;
  user: Schema.Types.ObjectId;
  comment:string;
  description: string;
  lastComments: string;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date; 
};

const ReplySchema = new Schema<Reply>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'userModel',
    required: true,
  },
  description: {
    type: String,
  },
  lastComments: { type: String, },
  likeCount: {
    type: Number,
   
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

export const  ReplyModel = models.Reply || model<Reply>('Reply', ReplySchema);
