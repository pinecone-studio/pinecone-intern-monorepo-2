import { GraphQLError } from 'graphql';
import Dislike from '../../../models/dislike';
import User from '../../../models/user';

const validateUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new GraphQLError("Хэрэглэгч олдсонгүй", {
      extensions: { code: "NOT_FOUND" },
    });
  }
  return user;
};

const validateNoExistingDislike = async (sender: string, receiver: string) => {
  const existingDislike = await Dislike.findOne({ sender, receiver });
  if (existingDislike) {
    throw new GraphQLError("Dislike дарсан байна", {
      extensions: { code: "BAD_REQUEST" },
    });
  }
};

export const createDislike = async (_: any, { sender, receiver }: { sender: string; receiver: string }) => {
  try {
    await validateUser(sender);
    await validateNoExistingDislike(sender, receiver);
    return await Dislike.create({ sender, receiver });
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Алдаа гарлаа", {
      extensions: { code: "INTERNAL_SERVER_ERROR", originalError: error },
    });
  }
}; 