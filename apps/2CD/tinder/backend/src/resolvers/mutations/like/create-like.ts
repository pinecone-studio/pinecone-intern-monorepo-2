import { GraphQLError } from "graphql";
import Like from "../../../models/like";
import User from "../../../models/user";
import Match from "../../../models/match";
import Message from "../../../models/message";

const validateUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new GraphQLError("Хэрэглэгч олдсонгүй", {
      extensions: { code: "NOT_FOUND" },
    });
  }
  return user;
};

const validateNoExistingLike = async (sender: string, receiver: string) => {
  const existingLike = await Like.findOne({ sender, receiver });
  if (existingLike) {
    throw new GraphQLError("Like дарсан байна", {
      extensions: { code: "BAD_REQUEST" },
    });
  }
};

const createMatchIfMutualLike = async (sender: string, receiver: string) => {
  const mutualLike = await Like.findOne({ sender: receiver, receiver: sender });
  if (!mutualLike) return null;

  const match = await Match.create({ users: [sender, receiver] });
  await User.findByIdAndUpdate(sender, { $push: { matches: match._id } });
  await User.findByIdAndUpdate(receiver, { $push: { matches: match._id } });
  await Message.create({
    match: match._id,
    sender,
    content: "It's a match! 👋",
  });
  return match;
};

export const createLike = async (_: any, { sender, receiver }: { sender: string; receiver: string }) => {
  try {
    await validateUser(sender);
    await validateNoExistingLike(sender, receiver);
    const like = await Like.create({ sender, receiver });
    await createMatchIfMutualLike(sender, receiver);
    return like;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Алдаа гарлаа", {
      extensions: { code: "INTERNAL_SERVER_ERROR", originalError: error },
    });
  }
};
