import { IUser, User } from "src/models/user";

interface GetUserByIdArgs {
  id: string;
}

export const getUserById = async (_: any, { id }: GetUserByIdArgs): Promise<IUser | null> => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    console.error("Error fetching user by id:", error);
    return null;  // or throw new Error("User not found");
  }
};
