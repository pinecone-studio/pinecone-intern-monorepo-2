import { Schema, model, models, Model } from "mongoose";

export type MessageType = {
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: Date;
  updatedAt: Date;
};

const messageSchema = new Schema<MessageType>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Message: Model<MessageType> =
  models.Message || model<MessageType>("Message", messageSchema);