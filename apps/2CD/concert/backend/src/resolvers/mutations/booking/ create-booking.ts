import { MutationResolvers } from 'src/generated';
import { bookingsModel } from 'src/models';
import { catchError } from 'src/utils/catch-error';
import { validateConcert } from 'src/utils/create-booking-validation.ts/validate-concert';
// import { validateTickets } from 'src/utils/create-booking-validation.ts/validate-tickets';
import { validateUser } from 'src/utils/create-booking-validation.ts/validate-user';


export const createBooking: MutationResolvers['createBooking'] = async (_, { input }) => {
  const { userId, concertId, tickets } = input;
  try {
    await validateUser(userId);
    await validateConcert(concertId);
    // await validateTickets(tickets);

    const booking = await bookingsModel.create({
      user: userId,
      concert: concertId,
      tickets: tickets,
      totalAmount: 0,
      status: 'PENDING',
    });
    const populatedBooking = await bookingsModel.findById(booking.id).populate('tickets').populate('concert').exec();
    return populatedBooking;
  } catch (error) {
    catchError(error);
  }
};