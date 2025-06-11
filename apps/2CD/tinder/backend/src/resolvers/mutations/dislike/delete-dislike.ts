import { GraphQLError } from 'graphql';
import Dislike from '../../../models/dislike';
import User from "src/models/user";

export const deleteDislike = async (_: any, { id }: { id: string }) => {
  try {
    const dislike = await Dislike.findById(id);
    if (!dislike) {
      throw new GraphQLError("Dislike олдсонгүй", {
        extensions: { code: "NOT_FOUND" },
      });
    }

    await Promise.all([
      User.findByIdAndUpdate(
        dislike.sender,
        { $pull: { dislikesTo: dislike._id } },
        { new: true }
      ),
      User.findByIdAndUpdate(
        dislike.receiver,
        { $pull: { dislikesFrom: dislike._id } },
        { new: true }
      ),
    ]);

    await Dislike.findByIdAndDelete(id);
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