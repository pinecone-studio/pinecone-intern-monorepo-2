import { QueryResolvers } from '../../../generated';
import Ticket from '../../../models/ticket.model';
import Venue from '../../../models/venue.model';

export const getTicketWithVenue: QueryResolvers['getTicketWithVenue'] = async (_, { input }, { userId }) => {
  if (!userId) throw new Error('Unauthorized');
  const { ticketId, venueId } = input;
  const findTicket = await Ticket.findById(ticketId);
  const findVenue = await Venue.findById(venueId);

  if (!findTicket || !findVenue) {
    throw new Error('Ticket or Venue not found');
  }
  return { findTicket, findVenue };
};
