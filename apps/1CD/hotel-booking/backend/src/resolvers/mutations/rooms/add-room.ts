import { GraphQLError } from 'graphql';
import { roomsModel } from '../../../models';
import { RoomTypeInput } from '../../../generated';

export const addRoom = async (_: unknown, { input }: { input: RoomTypeInput }) => {
  try {
    const createdRoom = await roomsModel.create({
      ...input,
      createdAt: new Date(),
    });
    return createdRoom;
  } catch (err) {
    throw new GraphQLError((err as Error).message);
  }
};
