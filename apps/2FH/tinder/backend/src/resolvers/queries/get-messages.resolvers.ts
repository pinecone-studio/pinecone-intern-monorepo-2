import { Types } from "mongoose";
import { Message } from "../../models";
import { GraphQLError } from "graphql";
import { formatMessage } from "../../utils/get-messages.formatting";
import { validateObjectId, validateUserIds } from "../../utils/get-messages.validation";
import { ERRORS } from "../../types/get-messages.types";

const buildFilter = (senderId?: string, receiverId?: string) => {
  const filter: Record<string, Types.ObjectId> = {};
  if (senderId) filter.sender = new Types.ObjectId(senderId);
  if (receiverId) filter.receiver = new Types.ObjectId(receiverId);
  return filter;
};

const fetchMessages = async (senderId?: string, receiverId?: string) => {
  const filter = buildFilter(senderId, receiverId);
  const messages = await Message.find(filter)
    .populate("sender", "email password createdAt updatedAt")
    .populate("receiver", "email password createdAt updatedAt")
    .sort({ createdAt: -1 })
    .exec();

  return messages.map(formatMessage);
};

const fetchMessageById = async (id: string) => {
  const message = await Message.findById(id)
    .populate("sender", "email password createdAt updatedAt")
    .populate("receiver", "email password createdAt updatedAt")
    .exec();

  if (!message) {
    throw new GraphQLError(ERRORS.MESSAGE_NOT_FOUND, {
      extensions: { code: "NOT_FOUND", http: { status: 404 } },
    });
  }
  return formatMessage(message);
};

export const getMessages = async (
  _: unknown,
  { senderId, receiverId }: { senderId?: string; receiverId?: string },
  _context: unknown,
  _info: unknown
) => {
  try {
    validateUserIds(senderId, receiverId);
    return await fetchMessages(senderId, receiverId);
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    console.error("Unexpected error in getMessages:", error);
    throw new GraphQLError(ERRORS.FETCH_FAILED, {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};

export const getMessage = async (
  _: unknown,
  { id }: { id: string },
  _context: unknown,
  _info: unknown
) => {
  try {
    validateObjectId(id);
    return await fetchMessageById(id);
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    console.error("Unexpected error in getMessage:", error);
    throw new GraphQLError(ERRORS.FETCH_FAILED, {
      extensions: { code: "INTERNAL_SERVER_ERROR" },
    });
  }
};
