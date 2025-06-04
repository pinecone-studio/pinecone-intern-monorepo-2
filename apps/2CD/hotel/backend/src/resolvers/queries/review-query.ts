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
      console.log('Fetching reviews for user:', userId);
      const query = { user: userId };
      console.log('MongoDB query:', JSON.stringify(query));
      
      const reviews = await Review.find(query)
        .populate('user', '_id email')
        .populate('hotel', '_id hotelName')
        .lean();
      
      console.log('Found reviews:', JSON.stringify(reviews, null, 2));
      const transformedReviews = (reviews as unknown as ReviewDocument[]).map(transformReview);
      console.log('Transformed reviews:', JSON.stringify(transformedReviews, null, 2));
      
      return transformedReviews;
    } catch (error) {
      console.error('Error fetching reviews by user:', error);
      throw new Error('Failed to fetch reviews by user');
    }
  },

  reviewsByHotel: async (_: unknown, { hotelId }: { hotelId: string }): Promise<TransformedReview[]> => {
    try {
      console.log('Fetching reviews for hotel:', hotelId);
      const query = { hotel: hotelId };
      console.log('MongoDB query:', JSON.stringify(query));
      
      const reviews = await Review.find(query)
        .populate('user', '_id email')
        .populate('hotel', '_id hotelName')
        .lean();
      
      console.log('Found reviews:', JSON.stringify(reviews, null, 2));
      const transformedReviews = (reviews as unknown as ReviewDocument[]).map(transformReview);
      console.log('Transformed reviews:', JSON.stringify(transformedReviews, null, 2));
      
      return transformedReviews;
    } catch (error) {
      console.error('Error fetching reviews by hotel:', error);
      throw new Error('Failed to fetch reviews by hotel');
    }
  },
};

export default reviewQueries;