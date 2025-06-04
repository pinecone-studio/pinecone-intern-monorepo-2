import { MutationResolvers, Response } from 'src/generated';
import { validateUser } from 'src/utils/create-booking.ts/validate-user';
import { validateConcert } from 'src/utils/create-booking.ts/validate-concert';
import { bookingsModel } from 'src/models';
import { calculateTotalAmount } from 'src/utils/create-booking.ts/calculate-total-amount';
import { bookingSchema } from 'src/zodSchemas/booking.zod';
import { validateTickets } from 'src/utils/create-booking.ts/validate-tickets';

export const createBooking: MutationResolvers['createBooking'] = async (_, { input }) => {
  const data = bookingSchema.parse(input);
  const { userId, concertId, tickets } = data;

    await validateUser(userId);
    await validateConcert(concertId);
    await validateTickets(tickets.map(t=>t.ticketId))

    const totalAmount = calculateTotalAmount(tickets);

    const transformedTickets = tickets.map((ticket) => ({
      ticket: ticket.ticketId,
      quantity: ticket.quantity,
      price: ticket.price,
    }));

    await bookingsModel.create({
      user: userId,
      concert: concertId,
      tickets: transformedTickets,
      totalAmount: totalAmount,
      status: 'PENDING',
    });
    return Response.Success
};
