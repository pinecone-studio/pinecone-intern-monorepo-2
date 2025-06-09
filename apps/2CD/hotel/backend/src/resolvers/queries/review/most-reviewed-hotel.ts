import { Review } from 'src/models/review';

export const mostReviewedHotels = async (_: unknown, args: { limit?: number } = {}) => {
  const limit = args.limit ?? 10;

  const results = await Review.aggregate([
    {
      $group: {
        _id: '$hotel',
        reviewCount: { $sum: 1 },
        averageRating: { $avg: '$star' },
      },
    },
    { $sort: { reviewCount: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'hotels',
        localField: '_id',
        foreignField: '_id',
        as: 'hotel',
      },
    },
    { $unwind: '$hotel' },
    {
      $project: {
        hotel: 1,
        reviewCount: 1,
        averageRating: { $round: ['$averageRating', 1] },
      },
    },
  ]);

  return results;
};
