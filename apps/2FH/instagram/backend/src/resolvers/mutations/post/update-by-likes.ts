import { GraphQLError } from 'graphql';
import { PostModel, PostSchemaType } from 'src/models';

interface UpdatePostInput {
  likes: string[];
}

function getInputLikes(input?: UpdatePostInput) {
  if (!input) {
    throw new Error('Input is missing');
  }

  if (!Array.isArray(input.likes)) {
    throw new Error('Likes is not an array');
  }

  // Allow empty array for unliking all posts
  return input.likes;
}

function validateId(_id: string) {
  if (!_id.trim()) throw new GraphQLError('Id is not found');
}

function assertPost(postPost: PostSchemaType | null): PostSchemaType {
  if (!postPost) throw new GraphQLError('Post not found');
  return postPost;
}
function getUpdateOps(currentLikes: string[], inputLikes: string[]) {
  // If inputLikes is empty, remove all likes
  if (inputLikes.length === 0) {
    return { $set: { likes: [] } };
  }
  
  // Otherwise, use the existing logic for adding/removing specific likes
  const toAdd = inputLikes.filter((id) => !currentLikes.includes(id));
  const toRemove = currentLikes.filter((id) => !inputLikes.includes(id));
  const updateOps: Record<string, unknown> = {};
  if (toAdd.length > 0) updateOps.$addToSet = { likes: { $each: toAdd } };
  if (toRemove.length > 0) updateOps.$pull = { likes: { $in: toRemove } };
  return updateOps;
}

export const updatePostByLikes = async (_: unknown, { _id, input }: { input: UpdatePostInput; _id: string }) => {
  validateId(_id);
  const inputLikes = getInputLikes(input);

  try {
    const post = assertPost(await PostModel.findById(_id));
    const currentLikes = post.likes.map((like) => like.toString());

    const updateOps = getUpdateOps(currentLikes, inputLikes);

    return assertPost(await PostModel.findByIdAndUpdate(_id, updateOps, { new: true }));
  } catch (error) {
    if (error instanceof GraphQLError) throw error;
    throw new GraphQLError('Failed to update post by likes:' + (error instanceof Error ? error.message : JSON.stringify(error)));
  }
};
