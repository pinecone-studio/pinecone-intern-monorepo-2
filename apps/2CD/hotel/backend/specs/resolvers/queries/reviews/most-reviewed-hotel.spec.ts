import { mostReviewedHotels } from 'src/resolvers/queries/most-reviewed-hotel';
import { Review } from 'src/models/review';

jest.mock('src/models/review', () => ({
  Review: {
    aggregate: jest.fn(),
  },
}));

describe('mostReviewedHotels', () => {
  it('should return hotels sorted by review count', async () => {
    const mockResults = [
      {
        hotel: { _id: '1', name: 'Hotel A' },
        reviewCount: 15,
        averageRating: 4.5,
      },
    ];

    (Review.aggregate as jest.Mock).mockResolvedValue(mockResults);

    const result = await mostReviewedHotels(null, { limit: 10 });

    expect(Review.aggregate).toHaveBeenCalledWith([
      {
        $group: {
          _id: '$hotel',
          reviewCount: { $sum: 1 },
          averageRating: { $avg: '$star' },
        },
      },
      { $sort: { reviewCount: -1 } },
      { $limit: 10 },
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

    expect(result).toEqual(mockResults);
  });

  it('should use default limit when no argument is passed', async () => {
    (Review.aggregate as jest.Mock).mockResolvedValue([]);

    const result = await mostReviewedHotels(null); // no second arg

    expect(Review.aggregate).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ $limit: 10 })]));
    expect(result).toEqual([]);
  });
});
