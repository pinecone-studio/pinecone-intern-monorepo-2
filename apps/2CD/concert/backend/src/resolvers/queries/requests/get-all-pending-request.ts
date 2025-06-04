import { QueryResolvers } from 'src/generated';
import { RequestModel } from 'src/models';

export const getPendingRequests: QueryResolvers['getPendingRequests'] = async () => {
  const result = await RequestModel.aggregate([
    {
      $match: {
        status: 'PENDING', // PENDING статустай хүсэлтүүд
      },
    },
    {
      $lookup: {
        from: 'bookings',
        localField: 'booking',
        foreignField: '_id',
        as: 'booking',
      },
    },
    {
      $unwind: '$booking',
    },
    {
      $lookup: {
        from: 'concerts',
        localField: 'booking.concert',
        foreignField: '_id',
        as: 'concert',
      },
    },
    {
      $unwind: '$concert',
    },
    {
      $lookup: {
        from: 'tickets',
        localField: 'booking.tickets.ticket',
        foreignField: '_id',
        as: 'ticketDetails',
      },
    },
    {
      $project: {
        id: '$_id',
        name: 1,
        bank: 1,
        bankAccount: 1,
        status: 1,
        createdAt: 1,
        booking: {
          id: '$booking._id',
          status: '$booking.status',
          concert: '$concert',
        },
        ticketDetails: 1,
      },
    },
  ]);

  return result;
};
