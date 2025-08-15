import { GraphQLError } from "graphql";

export const getJwtSecret = (): string => {
  if (!process.env.JWT_SECRET) {
    throw new GraphQLError("JWT_SECRET not found", {
      extensions:{
        code:"SECRET_NOT_FOUND"
      }
    });
  }
  return process.env.JWT_SECRET;
};
