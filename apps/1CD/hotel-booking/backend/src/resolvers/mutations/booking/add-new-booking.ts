import { GraphQLError } from 'graphql';
import { BookingInput } from 'src/generated';
import { bookingModel } from 'src/models';

export const addNewBooking = async (_: unknown, { input }: { input: BookingInput }) => {
  try {
    const createdBooking = await bookingModel.create({
      ...input,
      createdAt: new Date(),
    });

    return createdBooking;
  } catch (err) {
    throw new GraphQLError((err as Error).message);
  }
};
