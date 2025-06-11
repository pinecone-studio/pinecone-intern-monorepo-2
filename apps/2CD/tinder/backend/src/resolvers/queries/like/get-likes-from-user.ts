import { GraphQLError } from "graphql";
import Like from "../../../models/like";
import User from "../../../models/user";

export const getLikesFromUser = async (_: any, { userId }: { userId: string }) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new GraphQLError("Хэрэглэгч олдсонгүй", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    const likes = await Like.find({ sender: user._id })
      .populate('sender')
      .populate('receiver')
      .sort({ createdAt: -1 })
      .lean();

    return likes;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Алдаа гарлаа", {
      extensions: { code: "INTERNAL_SERVER_ERROR", originalError: error },
    });
  }
};
