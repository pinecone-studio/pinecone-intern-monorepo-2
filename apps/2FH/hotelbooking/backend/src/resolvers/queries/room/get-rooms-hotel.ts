import { GraphQLError } from 'graphql';
import { RoomModel } from 'src/models';
import { QueryResolvers, Room } from 'src/generated';

export const getRooms: QueryResolvers['getRooms'] = async (_: unknown, { hotelId }: { hotelId: string }) => {
  try {
    const rooms = await RoomModel.find({ hotelId });

    if (!rooms.length) {
      throw new GraphQLError(`No rooms found for hotelId: ${hotelId}`);
    }
    return rooms.map((room) => ({
      ...(room.toObject() as Room),
      id: room._id.toString(),
      imageURL: room.images || [],
    }));
  } catch (error) {
    console.error(error);
    throw new GraphQLError('Can not room By hotelId');
  }
};
