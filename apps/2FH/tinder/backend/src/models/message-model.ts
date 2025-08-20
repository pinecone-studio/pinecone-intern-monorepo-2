import  { Schema, model, models, Model, Types } from "mongoose";
 
export type MessageType = {
  match?: Types.ObjectId;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  content: string;
  createdAt: Date;
};
 
const messageSchema = new Schema<MessageType>(
  {
    match: { type: Schema.Types.ObjectId, ref: "Match", required: false },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);
 
export const Message: Model<MessageType> =
  models.Message || model<MessageType>("Message", messageSchema);