import { GraphQLError } from 'graphql';
import { Room } from 'src/models/room.model';

export const getRoomForId = async (
  _parent: unknown,
  { id }: { id: string }
) => {
  try {
    const room = await Room.findById(id).exec();

    if (!room) {
      throw new GraphQLError(`Room with id ${id} not found`, {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    return room;
  } catch (error) {
    throw new GraphQLError('Failed to fetch room', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        originalError: error,
      },
    });
  }
};
