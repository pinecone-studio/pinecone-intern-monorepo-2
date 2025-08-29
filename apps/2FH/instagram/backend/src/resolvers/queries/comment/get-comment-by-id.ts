import { GraphQLError } from 'graphql';
import { HydratedDocument, Types } from 'mongoose';
import { Comment, CommentSchemaType } from 'src/models';

interface getCommentByIdArg {
  _id: string;
}
type CommentDocument = HydratedDocument<CommentSchemaType>;
const validateId = (_id: string): void => {
  if (!_id) throw new GraphQLError('Id is reqiured');
  if (!Types.ObjectId.isValid(_id)) throw new GraphQLError('Invalid Comment ID');
};
const getComment = async (_id: string): Promise<CommentDocument> => {
  validateId(_id);
  const comment = await Comment.findById(_id);
  if (!comment) throw new GraphQLError('not found comment');
  return comment;
};
export const getCommentById = async (_: unknown, { _id }: getCommentByIdArg): Promise<CommentDocument> => {
  try {
    return await getComment(_id);
  } catch (error) {
    if (error instanceof GraphQLError) throw error;
    throw new GraphQLError('Failed to get comment by id: ' + (error instanceof Error ? error.message : JSON.stringify(error)));
  }
};

