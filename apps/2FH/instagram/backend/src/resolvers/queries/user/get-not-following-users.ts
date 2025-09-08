import { User } from "src/models/user";

export const getNotFollowingUsers = async (_: any, { userId }: { userId: string }) => {
  const currentUser = await User.findById(userId).populate("followings");
  if (!currentUser) {
    throw new Error("User not found");
  }
  const followingIds = currentUser.followings.map((u: any) => u._id);
  const notFollowingUsers = await User.find({
    _id: { $nin: [...followingIds, userId] }
  });

  return notFollowingUsers;
};
