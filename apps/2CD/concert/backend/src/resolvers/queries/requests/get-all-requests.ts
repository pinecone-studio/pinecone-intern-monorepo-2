import { QueryResolvers } from 'src/generated';
import { RequestModel } from 'src/models';
export const getAllRequests: QueryResolvers['getAllRequests'] = async () => {
  const result = await RequestModel.aggregate([
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
          totalAmount: 1,
        },
        ticketDetails: 1,
      },
    },
  ]);

  return result;
};
