import User from "src/models/user";

export const updateProfile = async (_: any, args: any, context: any) => {
  const { userId } = context;
  if (!userId) throw new Error('Unauthorized');

  const updatedUser = await User.findByIdAndUpdate(userId, args.input, { new: true });

  return updatedUser;
};
