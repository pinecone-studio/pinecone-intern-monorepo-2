import { GraphQLError } from 'graphql';
import { Reply, ReplySchemaType } from 'src/models';

interface UpdateReplyInput {
  likes: string[];
}

function getInputLikes(input?: UpdateReplyInput) {
  const likes = input?.likes ?? [];
  if (!likes.length) throw new GraphQLError('Likes input array is empty');
  return likes;
}

function validateId(_id: string) {
  if (!_id.trim()) throw new GraphQLError('Id is not found');
}

function assertReply(reply: ReplySchemaType | null): ReplySchemaType {
  if (!reply) throw new GraphQLError('Reply not found');
  return reply;
}
function getUpdateOps(currentLikes: string[], inputLikes: string[]) {
  const toAdd = inputLikes.filter((id) => !currentLikes.includes(id));
  const toRemove = inputLikes.filter((id) => currentLikes.includes(id));
  const updateOps: Record<string, unknown> = {};
  if (toAdd.length > 0) updateOps.$addToSet = { likes: { $each: toAdd } };
  if (toRemove.length > 0) updateOps.$pull = { likes: { $in: toRemove } };
  return updateOps;
}

export const updateReplyByLikes = async (_: unknown, _id: string, { input }: { input?: UpdateReplyInput }) => {
  validateId(_id);
  const inputLikes = getInputLikes(input);

  try {
    const reply = assertReply(await Reply.findById(_id));
    const currentLikes = reply.likes.map((like) => like.toString());

    const updateOps = getUpdateOps(currentLikes, inputLikes);

    return assertReply(await Reply.findByIdAndUpdate(_id, updateOps, { new: true }));
  } catch (error) {
    if (error instanceof GraphQLError) throw error;
    throw new GraphQLError('Failed to update likes:' + (error instanceof Error ? error.message : JSON.stringify(error)));
  }
};
