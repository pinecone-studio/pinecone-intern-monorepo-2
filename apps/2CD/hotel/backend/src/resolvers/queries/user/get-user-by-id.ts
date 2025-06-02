import { IUser, User } from "src/models/user";

interface GetUserByIdArgs {
  id: string;
}

export const getUserById = async (_: unknown, { id }: GetUserByIdArgs): Promise<IUser | null> => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    console.error("Error fetching user by id:", error);
    return null; 
  }
};