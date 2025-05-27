import Like from "src/models/like";

export const getLikesToUser = async (_: any, args: { userId: string }) => {
  return await Like.find({ to: args.userId })
    .populate("from")
    .populate("to")
    .sort({ createdAt: -1 }); // hamgiin suuld like darsan n ehend haragdna
}   