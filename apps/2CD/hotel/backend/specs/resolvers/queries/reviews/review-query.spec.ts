import { Review } from 'src/models/review';
import { reviewQueries, isValidDate, isValidUser, isValidHotel, isValidReview } from 'src/resolvers/queries/review-query';
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
    it('returns transformed valid reviews', async () => {
      const validReview = createMockReview();
      (Review.find as jest.Mock).mockReturnValue(setupMockReview([validReview]));
      const result = await reviewQueries.reviewsByUser(null, { userId: 'user123' });
      expect(result).toEqual([{
        id: validReview._id,
        user: validReview.user,
        hotel: validReview.hotel ? { id: validReview.hotel._id, hotelName: validReview.hotel.hotelName } : null,
        comment: validReview.comment,
        star: validReview.star,
        createdAt: validReview.createdAt,
        updatedAt: validReview.updatedAt
      }]);
    });

    it('filters out invalid reviews', async () => {
      const invalidReviews = [
        createMockReview({ _id: '' }),
        createMockReview({ comment: '' }),
        createMockReview({ star: 'invalid' as any })
      ];
      (Review.find as jest.Mock).mockReturnValue(setupMockReview(invalidReviews));
      expect(await reviewQueries.reviewsByUser(null, { userId: 'user123' })).toEqual([]);
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
    it('returns transformed valid reviews', async () => {
      const validReview = createMockReview();
      (Review.find as jest.Mock).mockReturnValue(setupMockReview([validReview]));
      const result = await reviewQueries.reviewsByHotel(null, { hotelId: 'hotel123' });
      expect(result).toEqual([{
        id: validReview._id,
        user: validReview.user,
        hotel: validReview.hotel ? { id: validReview.hotel._id, hotelName: validReview.hotel.hotelName } : null,
        comment: validReview.comment,
        star: validReview.star,
        createdAt: validReview.createdAt,
        updatedAt: validReview.updatedAt
      }]);
    });

    it('filters out invalid reviews', async () => {
      const invalidReviews = [
        createMockReview({ _id: '' }),
        createMockReview({ comment: '' }),
        createMockReview({ star: 'invalid' as any })
      ];
      (Review.find as jest.Mock).mockReturnValue(setupMockReview(invalidReviews));
      expect(await reviewQueries.reviewsByHotel(null, { hotelId: 'hotel123' })).toEqual([]);
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
});

describe('review-query helpers', () => {
  it('validates dates correctly', () => {
    expect(isValidDate(new Date())).toBe(true);
    expect(isValidDate('invalid')).toBe(false);
    expect(isValidDate(null)).toBe(false);
    expect(isValidDate(new Date('invalid'))).toBe(false);
  });

  it('validates users correctly', () => {
    expect(isValidUser({ _id: 'id', email: 'a@b.com' })).toBe(true);
    expect(isValidUser(null)).toBe(true);
    expect(isValidUser({})).toBe(false);
    expect(isValidUser({ _id: '' })).toBe(false);
    expect(isValidUser('not an object')).toBe(false);
  });

  it('validates hotels correctly', () => {
    expect(isValidHotel({ _id: 'id', hotelName: 'Hotel' })).toBe(true);
    expect(isValidHotel(null)).toBe(true);
    expect(isValidHotel({})).toBe(false);
    expect(isValidHotel({ _id: '' })).toBe(false);
    expect(isValidHotel('not an object')).toBe(false);
  });

  it('validates reviews correctly', () => {
    const validReview = createMockReview();
    const invalidReviews = [
      null,
      {},
      { _id: '' },
      { comment: '' },
      { star: 'invalid' },
      { user: { _id: '' }, hotel: { hotelName: '' } }
    ];

    expect(isValidReview(validReview)).toBe(true);
    invalidReviews.forEach(review => expect(isValidReview(review)).toBe(false));
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