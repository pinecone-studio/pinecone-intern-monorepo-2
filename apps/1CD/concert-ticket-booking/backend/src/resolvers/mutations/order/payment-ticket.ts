import { MutationResolvers, TicketType } from '../../../generated';
import Order from '../../../models/order.model';
import Ticket from '../../../models/ticket.model';
import UnitTicket from '../../../models/unit-ticket.model';
import { qrCodes } from '../../../utils/generate-qr';
import { sendEmailWithQr } from '../../../utils/sent-to-qr';

export const paymentTickets: MutationResolvers['paymentTickets'] = async (_, { orderId }) => {
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new Error('Order not found');
  }
  if (order.payment === 'pending') {
    order.payment = 'paid';
  } else {
    throw new Error('Already paid');
  }
  const findTicket = await Ticket.findById(order.ticketId);
  if (findTicket) {
    order.ticketType.forEach(({ _id, soldQuantity }: TicketType) => {
      const ticketIdx = findTicket.ticketType.findIndex((item: TicketType) => item._id.toString() === _id.toString());
      if (ticketIdx > -1) {
        if (findTicket.ticketType[ticketIdx].soldQuantity + Number(soldQuantity) < findTicket.ticketType[ticketIdx].totalQuantity) {
          findTicket.ticketType[ticketIdx].soldQuantity += Number(soldQuantity);
        } else {
          throw new Error('Seats are full');
        }
      }
    });
  }
  await findTicket.save();
  await order.save();
  const unitTicketArr = order.ticketType.flatMap((item: TicketType) =>
    Array(Number(item.soldQuantity))
      .fill(null)
      .map(() => ({
        productId: order.ticketId,
        ticketId: item._id,
        orderId: orderId,
        eventId: order.eventId,
      }))
  );
  const newUnitTicket = await UnitTicket.insertMany(unitTicketArr);
  const ids = newUnitTicket.map((item) => item._id);
  const qrCodeDataUrl = await qrCodes(ids);
  await sendEmailWithQr(order.email, qrCodeDataUrl);
  return { message: 'success' };
};
