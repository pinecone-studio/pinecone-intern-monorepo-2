import { GraphQLError } from 'graphql';
import { RoomModel } from 'src/models';
import { MutationResolvers, Response } from 'src/generated';

export const deleteRoom: MutationResolvers['deleteRoom'] = async (_: unknown, { id }: { id: string }) => {
  try {
    const deletedRoom = await RoomModel.findByIdAndDelete(id);

    if (!deletedRoom) {
      throw new GraphQLError('ID is not found');
    }

    return Response.Success;
  } catch (error) {
    console.error(error);
    throw new GraphQLError('Can not delete room');
  }
};
