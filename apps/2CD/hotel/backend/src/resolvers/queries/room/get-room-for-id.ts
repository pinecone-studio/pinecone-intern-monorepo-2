import { GraphQLError } from 'graphql';
import { Room } from 'src/models/room.model';

export const getRoomForId = async (_parent: unknown, { id }: { id: string }) => {
  try {
    const getRoom = await Room.findById(id).exec();
    if (!getRoom) {
      throw new GraphQLError(`Room with id ${id} not found`);
    }
    return getRoom;
  } catch (error) {
    return {
      success: false,
      data: null,
    };
  }
};
