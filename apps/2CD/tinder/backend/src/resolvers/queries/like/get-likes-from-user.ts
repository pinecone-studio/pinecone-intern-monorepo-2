import Like from "src/models/like";

export const getLikesFromUser = async (_: any, args: { userId: string }) => {
  return await Like.find({ from: args.userId })
    .populate("from")
    .populate("to")
    .sort({ createdAt: -1 });
};
