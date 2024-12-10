import Order from '../../../models/order.model';
import Ticket from '../../../models/ticket.model';
import Request from '../../../models/request.model';
import { MutationResolvers, TicketType } from '../../../generated';

export const cancelTicket: MutationResolvers['cancelTicket'] = async (_, { input }, { userId }) => {
  if (!userId) {
    throw new Error('must be login');
  }

  const { orderId, bankDatas } = input;
  const findOrder = await Order.findById(orderId);
  if (!findOrder) throw new Error('Order not found');

  const createdAt = new Date(findOrder.createdAt);
  const now = new Date();
  const timeDifferenceHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

  if (timeDifferenceHours > 24) {
    throw new Error('Cancellation not allowed after 24 hours');
  }
  const ticketUpdates = findOrder.ticketType.map((orderTicket: TicketType) => ({
    updateOne: {
      filter: { _id: findOrder.ticketId, 'ticketType._id': orderTicket._id },
      update: { $inc: { 'ticketType.$.soldQuantity': -orderTicket.soldQuantity } },
    },
  }));

  await Ticket.bulkWrite(ticketUpdates);
  await Order.updateOne({ _id: orderId }, { status: 'pending' });
  await Request.create({
    eventId: bankDatas.eventId,
    orderId: orderId,
    bankAccount: bankDatas.bankAccount,
    bankName: bankDatas.bankName,
    accountOwner: bankDatas.accountOwner,
    phoneNumber: bankDatas.phoneNumber,
    totalPrice: bankDatas.totalPrice,
  });

  return { message: 'Ticket successfully canceled' };
};
