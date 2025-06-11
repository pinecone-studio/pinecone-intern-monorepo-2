import { GraphQLError } from 'graphql';
import Like from '../../../models/like';
import User from "src/models/user";

export const deleteLike = async (_: any, { id }: { id: string }) => {
  try {
    const like = await Like.findById(id);
    if (!like) {
      throw new GraphQLError("Like олдсонгүй", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    await Promise.all([
      User.findByIdAndUpdate(
        like.sender,
        { $pull: { likesTo: like._id } },
        { new: true }
      ),
      User.findByIdAndUpdate(
        like.receiver,
        { $pull: { likesFrom: like._id } },
        { new: true }
      ),
    ]);

    await Like.findByIdAndDelete(id);
    return true;
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError("Алдаа гарлаа", {
      extensions: { code: "INTERNAL_SERVER_ERROR", originalError: error },
    });
  }
}; 