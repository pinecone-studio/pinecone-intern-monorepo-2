import { MutationResolvers, Response } from 'src/generated';
import { validateUser } from 'src/utils/create-booking.ts/validate-user';
import { validateConcert } from 'src/utils/create-booking.ts/validate-concert';
import { bookingsModel } from 'src/models';
import { calculateTotalAmount } from 'src/utils/create-booking.ts/calculate-total-amount';
import { bookingSchema } from 'src/zodSchemas/booking.zod';
import { decrementTicketStock } from 'src/utils/create-booking.ts/decrease-ticket-quantity';

export const createBooking: MutationResolvers['createBooking'] = async (_, { input }) => {
  const data = bookingSchema.parse(input);
  const { userId, concertId, tickets } = data;

  await validateUser(userId);
  await validateConcert(concertId);

  for (const ticket of tickets) {
    try {
      await decrementTicketStock(ticket.ticketId, ticket.quantity);
    } catch (err) {
      console.error('Ticket stock update failed:', err);
      throw err;
    }
  }
  const transformedTickets = tickets.map((ticket) => ({
    ticket: ticket.ticketId,
    quantity: ticket.quantity,
  }));

  await bookingsModel.create({
    user: userId,
    concert: concertId,
    tickets: transformedTickets,
    totalAmount: await calculateTotalAmount(tickets),
    status: 'PENDING',
  });
  return Response.Success;
};
