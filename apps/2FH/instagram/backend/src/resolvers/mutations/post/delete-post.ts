import { GraphQLError } from 'graphql';
import { PostModel } from 'src/models';

function validateId(_id: string) {
  if (!_id || _id.trim() === '') {
    throw new GraphQLError('Id is not found');
  }
}

async function checkAuthor(_id: string, userId: string) {
  const post = await PostModel.findById(_id);
  if (!post) {
    throw new GraphQLError('Post not found');
  }

  if (post.author._id.toString() !== userId) {
    throw new GraphQLError('You are not the author of this post');
  }
}

async function removePostById(_id: string) {
  const deletedPost = await PostModel.findByIdAndDelete({ _id });
  if (!deletedPost) {
    throw new GraphQLError('Post is not found');
  }
  return deletedPost;
}

export const deletePost = async (_: unknown, { _id, userId }: { _id: string; userId: string }) => {
  try {
    validateId(_id);
    await checkAuthor(_id, userId);
    return await removePostById(_id);
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new GraphQLError('Failed to delete post: ' + message);
  }
};
