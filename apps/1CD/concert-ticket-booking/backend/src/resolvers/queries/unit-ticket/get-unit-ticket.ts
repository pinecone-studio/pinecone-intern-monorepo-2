import { QueryResolvers } from '../../../generated';
import UnitTicket from '../../../models/unit-ticket.model';

export const getUnitTicket: QueryResolvers['getUnitTicket'] = async (_, { ticketId }) => {
  console.log('ticketId', ticketId);
  const findTicket = await UnitTicket.findOne({ ticketId }).populate(['orderId', 'eventId']);

  console.log('findticket', findTicket);
  if (!findTicket) {
    throw new Error('Ticket not found');
  }
  return findTicket;
};
