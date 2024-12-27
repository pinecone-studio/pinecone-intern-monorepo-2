import { QueryResolvers } from '../../../generated';
import UnitTicket from '../../../models/unit-ticket.model';

export const getUnitTicket: QueryResolvers['getUnitTicket'] = async (_, { unitId }) => {
  const findTicket = await UnitTicket.findById(unitId).populate(['orderId', 'eventId', 'productId']);

  if (!findTicket) {
    throw new Error('Ticket not found');
  }
  return findTicket;
};
