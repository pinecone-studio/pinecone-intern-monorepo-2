import { Review } from 'src/models/review';
import { reviewQueries } from 'src/resolvers/queries/review-query';
import { ReviewDocument } from 'src/types/review';

jest.mock('src/models/review');

const createMockReview = (overrides = {}): ReviewDocument => ({
  _id: 'review123',
  user: { _id: 'user123', email: 'test@example.com' },
  hotel: { _id: 'hotel123', hotelName: 'Test Hotel' },
  comment: 'Great hotel!',
  star: 5,
  createdAt: new Date('2025-06-02T04:16:31.798Z'),
  updatedAt: new Date('2025-06-02T04:16:31.798Z'),
  ...overrides
});

const setupMockReview = (reviews: ReviewDocument[]) => ({
  populate: jest.fn().mockReturnThis(),
  lean: jest.fn().mockResolvedValue(reviews)
});

describe('Review Queries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('reviewsByUser', () => {
    it('returns transformed reviews', async () => {
      const review = createMockReview();
      (Review.find as jest.Mock).mockReturnValue(setupMockReview([review]));
      const result = await reviewQueries.reviewsByUser(null, { userId: 'user123' });
      expect(result).toEqual([{
        id: review._id,
        user: review.user,
        hotel: review.hotel ? { id: review.hotel._id, hotelName: review.hotel.hotelName } : null,
        comment: review.comment,
        star: review.star,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt
      }]);
    });

    it('handles database errors', async () => {
      (Review.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockRejectedValue(new Error('DB error'))
      });
      await expect(reviewQueries.reviewsByUser(null, { userId: 'user123' }))
        .rejects.toThrow('Failed to fetch reviews by user');
    });
  });

  describe('reviewsByHotel', () => {
    it('returns transformed reviews', async () => {
      const review = createMockReview();
      (Review.find as jest.Mock).mockReturnValue(setupMockReview([review]));
      const result = await reviewQueries.reviewsByHotel(null, { hotelId: 'hotel123' });
      expect(result).toEqual([{
        id: review._id,
        user: review.user,
        hotel: review.hotel ? { id: review.hotel._id, hotelName: review.hotel.hotelName } : null,
        comment: review.comment,
        star: review.star,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt
      }]);
    });

    it('handles database errors', async () => {
      (Review.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockRejectedValue(new Error('DB error'))
      });
      await expect(reviewQueries.reviewsByHotel(null, { hotelId: 'hotel123' }))
        .rejects.toThrow('Failed to fetch reviews by hotel');
    });
  });

  it('transforms reviews with null user and hotel', async () => {
    const review = createMockReview({ user: null, hotel: null });
    (Review.find as jest.Mock).mockReturnValue(setupMockReview([review]));
    const result = await reviewQueries.reviewsByUser(null, { userId: 'user123' });
    expect(result).toEqual([{
      id: review._id,
      user: null,
      hotel: null,
      comment: review.comment,
      star: review.star,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt
    }]);
  });
});