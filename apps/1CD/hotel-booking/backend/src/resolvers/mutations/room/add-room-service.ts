import { GraphQLError } from 'graphql';
import { roomsModel } from '../../../models';
import { RoomServiceInput } from '../../../generated';

export const addRoomService = async (_: unknown, { input, roomId }: { input: RoomServiceInput; roomId: string }) => {

  try {
    const addRoomService = await roomsModel.findByIdAndUpdate(
      { _id: roomId },
      {
        roomService: {
          ...input,
        },
      }
    );
    console.log({addRoomService})
    return addRoomService;
  } catch (error) {
    throw new GraphQLError((error as Error).message);
  }
};
