import { GraphQLError } from 'graphql';
import { roomsModel } from '../../../models';
import { RoomTypeInput } from '../../../generated';
import { roomsPriceAverage } from 'src/components/rooms-price-average';

export const addRoom = async (_: unknown, { input }: { input: RoomTypeInput }) => {
  try {
    const createdRoom = await roomsModel.create({
      ...input,
      createdAt: new Date(),
    });
    await roomsPriceAverage({ _id: input.hotelId });
    return createdRoom;
  } catch (err) {
    throw new GraphQLError((err as Error).message);
  }
};
