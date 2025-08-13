import  { Schema, model, models, Model, Types } from "mongoose";
 
export type MessageType = {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};
 
const messageSchema = new Schema<MessageType>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);
 
export const Message: Model<MessageType> =
  models.Message || model<MessageType>("Message", messageSchema);