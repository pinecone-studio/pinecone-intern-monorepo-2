import { Review } from 'src/models/review';
import { ReviewDocument, TransformedReview } from 'src/types/review';

const transformReview = (review: ReviewDocument): TransformedReview => ({
  id: review._id,
  user: review.user || null,
  hotel: review.hotel ? { id: review.hotel._id, hotelName: review.hotel.hotelName } : null,
  comment: review.comment,
  star: review.star,
  createdAt: review.createdAt,
  updatedAt: review.updatedAt,
});

export const reviewQueries = {
  reviewsByUser: async (_: unknown, { userId }: { userId: string }): Promise<TransformedReview[]> => {
    try {
      const query = { user: userId };

      const reviews = await Review.find(query).populate('user', '_id email').populate('hotel', '_id hotelName').lean();
      const transformedReviews = (reviews as unknown as ReviewDocument[]).map(transformReview);

      return transformedReviews;
    } catch (error) {
      throw new Error('Failed to fetch reviews by user', { cause: error });
    }
  },

  reviewsByHotel: async (_: unknown, { hotelId }: { hotelId: string }): Promise<TransformedReview[]> => {
    try {
      const query = { hotel: hotelId };

      const reviews = await Review.find(query).populate('user', '_id email').populate('hotel', '_id hotelName').lean();

      const transformedReviews = (reviews as unknown as ReviewDocument[]).map(transformReview);

      return transformedReviews;
    } catch (error) {
      throw new Error('Failed to fetch reviews by hotel', { cause: error });
    }
  },
};

export default reviewQueries;
