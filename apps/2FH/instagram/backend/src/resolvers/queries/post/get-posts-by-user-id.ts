import { GraphQLError } from 'graphql';
import { HydratedDocument, Types } from 'mongoose';
import { PostModel, PostSchemaType } from 'src/models';

type PostDocument = HydratedDocument<PostSchemaType>;

interface getPostByAuthorInput {
  author: string;
}

function validateId(author: string) {
  if (!author) throw new GraphQLError('Author ID is required');
  if (!Types.ObjectId.isValid(author)) throw new GraphQLError('Invalid author ID');
}

function normalizeAndAssertPosts(posts: PostDocument[] | null | undefined): PostDocument[] {
  if (!posts) return [];
  if (Array.isArray(posts) && posts.length === 0) {
    throw new GraphQLError('No posts found for the given author.');
  }
  return posts;
}

export async function getPostsByAuthor(_: unknown, { author }: getPostByAuthorInput): Promise<PostDocument[]> {
  validateId(author);
  try {
    const posts = await PostModel.find({ author }).sort({ createdAt: -1 });
    return normalizeAndAssertPosts(posts as unknown as PostDocument[] | null | undefined);
  } catch (error) {
    throw new GraphQLError('Failed to get posts by author ID: ' + (error instanceof Error ? error.message : JSON.stringify(error)));
  }
}
