import { Review } from '../../models/review';
import { User } from '../../models/user';
import { Hotel } from '../../models/hotel';

type ReviewInput = {
  user: string;
  hotel: string;
  comment: string;
  star: number;
};

const validateReviewInput = async (user: string, hotel: string) => {
  const [foundUser, foundHotel] = await Promise.all([User.findById(user), Hotel.findById(hotel)]);

  if (!foundUser) throw new Error(`User with ID ${user} not found`);
  if (!foundHotel) throw new Error(`Hotel with ID ${hotel} not found`);
};

const reviewMutations = {
  createReview: async (_: unknown, { input }: { input: ReviewInput }) => {
    try {
      const { user, hotel, comment, star } = input;
      await validateReviewInput(user, hotel);

      const review = await Review.create({
        user,
        hotel,
        comment,
        star,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).then((newReview) => Review.findById(newReview._id).populate('user', '_id email').populate('hotel', 'id hotelName'));

      if (!review) throw new Error('Failed to create or populate review');
      return review;
    } catch (error: unknown) {
      console.error('Error creating review:', error);
      throw error instanceof Error ? new Error(`Failed to create review: ${error.message}`) : new Error('Failed to create review: Unknown error');
    }
  },
  updateReview: async (_: unknown, { id, input }: { id: string; input: ReviewInput }) => {
    try {
      const review = await Review.findByIdAndUpdate(id, input, { new: true });
      if (!review) {
        throw new Error(`Review with id ${id} not found`);
      }
      return review;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to update review: ${error.message}`);
      }
      throw new Error('Failed to update review: Unknown error');
    }
  },
};

export default reviewMutations;
