import { GraphQLError } from "graphql";
import { User } from "src/models";

export const checkEmailExists = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new GraphQLError("User not found", {
      extensions: { code: "NOT_FOUND" },
    });
  }
  return user;
};