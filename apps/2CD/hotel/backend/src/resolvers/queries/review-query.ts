import { Review } from 'src/models/review';
import { ReviewDocument, TransformedReview } from 'src/types/review';

const isValidDate = (date: unknown): boolean => {
  if (date instanceof Date) {
    return !isNaN(date.getTime());
  }
  if (typeof date === 'string') {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }
  return false;
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
  return (user._id !== null && user._id !== undefined) && isValidString(user.email);
};

const validateHotelFields = (hotel: { _id?: unknown; hotelName?: unknown }): boolean => {
  return (hotel._id !== null && hotel._id !== undefined) && isValidString(hotel.hotelName);
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

class ReviewValidator {
  private static validateId(id: unknown): boolean {
    return id !== null && id !== undefined && id !== '';
  }

  private static validateComment(comment: unknown): boolean {
    return isValidString(comment);
  }

  private static validateStar(star: unknown): boolean {
    return isValidNumber(star);
  }

  static validateBasicFields(review: ReviewDocument): boolean {
    const hasValidId = this.validateId(review._id);
    const hasValidComment = this.validateComment(review.comment);
    const hasValidStar = this.validateStar(review.star);
    return hasValidId && hasValidComment && hasValidStar;
  }

  static validateDates(review: ReviewDocument): boolean {
    const hasValidCreatedAt = isValidDate(review.createdAt);
    const hasValidUpdatedAt = isValidDate(review.updatedAt);
    return hasValidCreatedAt && hasValidUpdatedAt;
  }

  static validateRelations(review: ReviewDocument): boolean {
    const hasValidUser = isValidUser(review.user);
    const hasValidHotel = isValidHotel(review.hotel);
    return hasValidUser && hasValidHotel;
  }

  static validateObject(review: unknown): review is ReviewDocument {
    return isValidObject(review);
  }

  static isValid(review: unknown): boolean {
    if (!this.validateObject(review)) return false;
    const hasValidBasicFields = this.validateBasicFields(review);
    const hasValidDates = this.validateDates(review);
    const hasValidRelations = this.validateRelations(review);
    return hasValidBasicFields && hasValidDates && hasValidRelations;
  }
}

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
      console.log('Fetching reviews for user:', userId);
      const reviews = await Review.find({ user: userId })
        .populate('user', '_id email')
        .populate('hotel', '_id hotelName')
        .lean();
      
      console.log('Found reviews:', reviews);
      
      const validReviews = (reviews as unknown as ReviewDocument[])
        .filter((review) => ReviewValidator.isValid(review))
        .map(transformReview);
      
      console.log('Valid reviews after transformation:', validReviews);
      
      return validReviews;
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
        .filter((review) => ReviewValidator.isValid(review))
        .map(transformReview);
    } catch (error) {
      console.error('Error fetching reviews by hotel:', error);
      throw new Error('Failed to fetch reviews by hotel');
    }
  },
};

export { isValidDate, isValidUser, isValidHotel, ReviewValidator };