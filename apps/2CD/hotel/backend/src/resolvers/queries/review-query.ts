import { Review } from 'src/models/review';
import { ReviewDocument, TransformedReview } from 'src/types/review';

const isValidDate = (date: unknown): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

const isValidString = (value: unknown): boolean => {
  return typeof value === 'string' && value.length > 0;
};

const isValidNumber = (value: unknown): boolean => {
  return typeof value === 'number';
};

const isValidObject = (value: unknown): boolean => {
  return value !== null && value !== undefined && typeof value === 'object';
};

const validateUserFields = (user: { _id?: unknown; email?: unknown }): boolean => {
  return isValidString(user._id) && isValidString(user.email);
};

const validateHotelFields = (hotel: { _id?: unknown; hotelName?: unknown }): boolean => {
  return isValidString(hotel._id) && isValidString(hotel.hotelName);
};

const isValidUser = (user: unknown): boolean => {
  if (user === null || user === undefined) return true;
  if (!isValidObject(user)) return false;
  return validateUserFields(user as { _id?: unknown; email?: unknown });
};

const isValidHotel = (hotel: unknown): boolean => {
  if (hotel === null || hotel === undefined) return true;
  if (!isValidObject(hotel)) return false;
  return validateHotelFields(hotel as { _id?: unknown; hotelName?: unknown });
};

const validateReviewBasicFields = (review: ReviewDocument): boolean => {
  return isValidString(review._id) && 
         isValidString(review.comment) && 
         isValidNumber(review.star);
};

const validateReviewDates = (review: ReviewDocument): boolean => {
  return isValidDate(review.createdAt) && isValidDate(review.updatedAt);
};

const validateReviewFields = (review: unknown): boolean => {
  if (!isValidObject(review)) return false;
  const reviewObj = review as ReviewDocument;
  return validateReviewBasicFields(reviewObj) && validateReviewDates(reviewObj);
};

const validateReviewRelations = (review: ReviewDocument): boolean => {
  return isValidUser(review.user) && isValidHotel(review.hotel);
};

const isValidReview = (review: unknown): boolean => {
  if (!validateReviewFields(review)) return false;
  return validateReviewRelations(review as ReviewDocument);
};

const transformReview = (review: ReviewDocument): TransformedReview => ({
  id: review._id,
  user: review.user || null,
  hotel: review.hotel && isValidHotel(review.hotel) 
    ? { id: review.hotel._id, hotelName: review.hotel.hotelName } 
    : null,
  comment: review.comment,
  star: review.star,
  createdAt: review.createdAt,
  updatedAt: review.updatedAt,
});

export const reviewQueries = {
  reviewsByUser: async (_: unknown, { userId }: { userId: string }): Promise<TransformedReview[]> => {
    try {
      const reviews = await Review.find({ user: userId })
        .populate('user', '_id email')
        .populate('hotel', '_id hotelName')
        .lean();
      return (reviews as unknown as ReviewDocument[])
        .filter(isValidReview)
        .map(transformReview);
    } catch (error) {
      console.error('Error fetching reviews by user:', error);
      throw new Error('Failed to fetch reviews by user');
    }
  },

  reviewsByHotel: async (_: unknown, { hotelId }: { hotelId: string }): Promise<TransformedReview[]> => {
    try {
      const reviews = await Review.find({ hotel: hotelId })
        .populate('user', '_id email')
        .populate('hotel', '_id hotelName')
        .lean();
      return (reviews as unknown as ReviewDocument[])
        .filter(isValidReview)
        .map(transformReview);
    } catch (error) {
      console.error('Error fetching reviews by hotel:', error);
      throw new Error('Failed to fetch reviews by hotel');
    }
  },
};

export { isValidDate, isValidUser, isValidHotel, isValidReview };