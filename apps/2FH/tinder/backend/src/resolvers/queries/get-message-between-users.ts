import { QueryResolvers } from "../../generated";
import { Message } from "../../models";
import { formatMessage } from "../../utils/get-messages.formatting";

export const getMessagesBetweenUsers: QueryResolvers["getMessagesBetweenUsers"] = async (
  _,
  { userId1, userId2 }
) => {
  const messages = await Message.find({
    $or: [
      { sender: userId1, receiver: userId2 },
      { sender: userId2, receiver: userId1 },
    ],
  })
    .populate("sender", "email password createdAt updatedAt")
    .populate("receiver", "email password createdAt updatedAt")
    .sort({ createdAt: -1 })
    .exec();

  return messages.map(formatMessage);
};
