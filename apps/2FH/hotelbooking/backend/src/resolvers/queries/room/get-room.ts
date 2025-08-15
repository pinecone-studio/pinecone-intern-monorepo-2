import { RoomModel } from 'src/models';
import { GraphQLError } from 'graphql';
import { QueryResolvers } from 'src/generated';

export const getRoom: QueryResolvers['getRoom'] = async (_: unknown, { id }: { id: string }) => {
  try {
    const room = await RoomModel.findById(id);

    if (!room) {
      throw new Error('Room not found');
    }

    return {
      id: room._id.toString(),
      imageURL: room.images || [],
      ...room.toObject(),
    };
  } catch (error) {
    console.error(error);
    throw new GraphQLError('Cannot fecth room');
  }
};
