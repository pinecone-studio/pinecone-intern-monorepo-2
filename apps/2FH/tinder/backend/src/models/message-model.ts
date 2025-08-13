import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const messageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
  }, { timestamps: true });
  
  export const Message = models.Message || model("Message", messageSchema);