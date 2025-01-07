import { MutationResolvers, TicketType } from '../../../generated';
import Order from '../../../models/order.model';
import Ticket from '../../../models/ticket.model';

export const addToCarts: MutationResolvers['addToCarts'] = async (_, { input }, { userId }) => {
  if (!userId) throw new Error('Unauthorized');

  const { ticketId, ticketType, eventId, phoneNumber, email } = input;
  const findTicket = await Ticket.findById(ticketId);
  if (findTicket) {
    ticketType.forEach(({ _id, buyQuantity }) => {
      const ticketIdx = findTicket.ticketType.findIndex((item: TicketType) => item._id.toString() === _id.toString());
      if (ticketIdx > -1) {
        if (findTicket.ticketType[ticketIdx].soldQuantity + Number(buyQuantity) < findTicket.ticketType[ticketIdx].totalQuantity) {
          findTicket.ticketType[ticketIdx].soldQuantity += Number(buyQuantity);
        } else {
          throw new Error('Seats are full');
        }
      }
    });
  }
  const updatedTicketTypes = ticketType.map((item) => {
    const matchedTicket = findTicket.ticketType.find((x: TicketType) => x._id.toString() === item._id.toString());
    if (matchedTicket) {
      matchedTicket.soldQuantity = item.buyQuantity;
      return matchedTicket;
    }
  });

  const order = await Order.create({ userId, ticketId, eventId, phoneNumber, email, ticketType: updatedTicketTypes });

  return order;
};
