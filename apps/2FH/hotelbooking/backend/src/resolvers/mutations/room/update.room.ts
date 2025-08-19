import { RoomModel } from 'src/models';
import { GraphQLError } from 'graphql';
import { MutationResolvers, RoomUpdateInput, Response } from 'src/generated';

export const updateRoom: MutationResolvers['updateRoom'] = async (_: unknown, { id, input }: { id: string; input: RoomUpdateInput }) => {
  try {
    const updatedRoom = await RoomModel.findByIdAndUpdate(id, { ...input }, { new: true });

    if (!updatedRoom) {
      throw new GraphQLError('Room not found');
    }
    return Response.Success;
  } catch (error) {
    console.error(error);
    throw new GraphQLError('Cannot update room');
  }
};
