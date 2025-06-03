import { QueryResolvers } from 'src/generated';
import { RequestModel } from 'src/models';

export const getPendingRequests: QueryResolvers['getPendingRequests'] = async () => {
  const pendingRequests = await RequestModel.find({
    status: 'PENDING',
  })
    .populate('booking')
    .populate('user')
    .populate({
      path: 'booking',
      populate: {
        path: 'tickets.ticket',
        model: 'Ticket',
      },
    });
  return pendingRequests.map((doc) => ({
    id: doc.id,
    booking: doc.booking,
    user: doc.user,
    status: doc.status,
    bank: doc.bank,
    bankAccount: doc.bankAccount,
    name: doc.name,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }));
};
