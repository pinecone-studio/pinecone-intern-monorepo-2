import { GraphQLError } from 'graphql';
import { HydratedDocument, Types } from 'mongoose';
import { Comment, CommentSchemaType } from 'src/models';

interface getCommentByParentIdArg {
  parentId: string;
}
type CommentDocument = HydratedDocument<CommentSchemaType>;
const validateId = (parentId: string): void => {
  if (!parentId) throw new GraphQLError('Id is reqiured');
  if (!Types.ObjectId.isValid(parentId)) throw new GraphQLError('Invalid Comment ID');
};
const getComments = async (parentId: string): Promise<CommentDocument[]> => {
  validateId(parentId);
  const comments = await Comment.find({ parentId });
  if (!comments) throw new GraphQLError('not found comments');
  return comments;
};
export const getCommentByParentId = async (_: unknown, { parentId }: getCommentByParentIdArg): Promise<CommentDocument[]> => {
  try {
    return await getComments(parentId);
  } catch (error) {
    if (error instanceof GraphQLError) throw error;
    throw new GraphQLError('Failed to get comment by parent id: ' + (error instanceof Error ? error.message : JSON.stringify(error)));
  }
};
