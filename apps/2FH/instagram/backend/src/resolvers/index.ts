import * as Mutation from './mutations';
import * as Query from './queries';
import { CommentResolvers } from './types/comment';

export const resolvers = {
  Mutation,
  Query,
  ...CommentResolvers,
};
