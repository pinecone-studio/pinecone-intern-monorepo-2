import { GraphQLError } from 'graphql';
import { HydratedDocument, Types } from 'mongoose';
import { PostModel, PostSchemaType } from 'src/models';

interface getPostInput {
  _id: string;
}
type PostDocument = HydratedDocument<PostSchemaType>;

const validateId = (_id: string): void => {
  if (!_id) throw new GraphQLError('_id is reqiured');
  if (!Types.ObjectId.isValid(_id)) throw new GraphQLError('Invalid ID');
};

export async function GetPostById(_: unknown, { _id }: getPostInput): Promise<PostDocument> {
  try {
    validateId(_id);
    const Post = await PostModel.findById(_id).populate('author').populate('likes').populate('comments.author').populate('comments.likes');
    if (!Post) {
      throw new GraphQLError('Post not found');
    }
    return Post;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new GraphQLError('Failed to get post by id: ' + message);
  }
}
