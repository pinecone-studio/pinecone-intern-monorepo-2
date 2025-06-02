import { Review } from '../../../src/models/review';
import { User } from '../../../src/models/user';
import { Hotel } from '../../../src/models/hotel';
import reviewMutations from '../../../src/resolvers/mutations/review-mutations';

jest.mock('../../../src/models/review');
jest.mock('../../../src/models/user');
jest.mock('../../../src/models/hotel');

describe('Review Mutations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createReview', () => {
    const mockInput = {
      user: 'user123',
      hotel: 'hotel123',
      comment: 'Great hotel!',
      star: 5,
    };

    const mockUser = {
      _id: 'user123',
      email: 'test@example.com',
    };

    const mockHotel = {
      _id: 'hotel123',
      hotelName: 'Test Hotel',
    };

    const mockReview = {
      _id: 'review123',
      user: mockUser,
      hotel: mockHotel,
      comment: mockInput.comment,
      star: mockInput.star,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a new review successfully', async () => {
      // First populate returns an object with a second populate
      const secondPopulate = jest.fn().mockReturnValue(mockReview);
      const firstPopulate = jest.fn().mockReturnValue({ populate: secondPopulate });

      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (Hotel.findById as jest.Mock).mockResolvedValue(mockHotel);
      (Review.create as jest.Mock).mockResolvedValue(mockReview);
      (Review.findById as jest.Mock).mockReturnValue({ populate: firstPopulate });

      const result = await reviewMutations.createReview(null, { input: mockInput });

      expect(result).toEqual(mockReview);
      expect(Review.create).toHaveBeenCalledWith({
        user: mockInput.user,
        hotel: mockInput.hotel,
        comment: mockInput.comment,
        star: mockInput.star,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
      expect(Review.findById).toHaveBeenCalledWith(mockReview._id);
      expect(firstPopulate).toHaveBeenCalledWith('user', '_id email');
      expect(secondPopulate).toHaveBeenCalledWith('hotel', 'id hotelName');
    });

    it('should throw error when user not found', async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      await expect(reviewMutations.createReview(null, { input: mockInput })).rejects.toThrow('User with ID user123 not found');
    });

    it('should throw error when hotel not found', async () => {
      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (Hotel.findById as jest.Mock).mockResolvedValue(null);

      await expect(reviewMutations.createReview(null, { input: mockInput })).rejects.toThrow('Hotel with ID hotel123 not found');
    });

    it('should throw error when createReview throws', async () => {
      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (Hotel.findById as jest.Mock).mockResolvedValue(mockHotel);
      (Review.create as jest.Mock).mockImplementation(() => {
        throw new Error('DB error');
      });
      await expect(reviewMutations.createReview(null, { input: mockInput })).rejects.toThrow('Failed to create review: DB error');
    });

    it('should throw error when review is not found after creation', async () => {
      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (Hotel.findById as jest.Mock).mockResolvedValue(mockHotel);
      (Review.create as jest.Mock).mockResolvedValue(mockReview);
      (Review.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(null),
        }),
      });

      await expect(reviewMutations.createReview(null, { input: mockInput })).rejects.toThrow('Failed to create review: Failed to create or populate review');
    });

    it('should throw error when createReview throws non-Error object', async () => {
      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (Hotel.findById as jest.Mock).mockResolvedValue(mockHotel);
      (Review.create as jest.Mock).mockImplementation(() => {
        throw 'string error';
      });

      await expect(reviewMutations.createReview(null, { input: mockInput })).rejects.toThrow('Failed to create review: Unknown error');
    });
  });

  describe('updateReview', () => {
    const mockInput = {
      user: 'user123',
      hotel: 'hotel123',
      comment: 'Updated comment',
      star: 4,
    };

    const mockUpdatedReview = {
      _id: 'review123',
      ...mockInput,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should update a review successfully', async () => {
      (Review.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedReview);

      const result = await reviewMutations.updateReview(null, { id: 'review123', input: mockInput });

      expect(result).toEqual(mockUpdatedReview);
      expect(Review.findByIdAndUpdate).toHaveBeenCalledWith('review123', mockInput, { new: true });
    });

    it('should throw error when review not found', async () => {
      (Review.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(reviewMutations.updateReview(null, { id: 'review123', input: mockInput })).rejects.toThrow('Review with id review123 not found');
    });

    it('should throw error when updateReview throws', async () => {
      (Review.findByIdAndUpdate as jest.Mock).mockImplementation(() => {
        throw new Error('DB error');
      });
      await expect(reviewMutations.updateReview(null, { id: 'review123', input: mockInput })).rejects.toThrow('Failed to update review: DB error');
    });

    it('should throw error when updateReview throws non-Error object', async () => {
      (Review.findByIdAndUpdate as jest.Mock).mockImplementation(() => {
        throw 'string error';
      });
      await expect(reviewMutations.updateReview(null, { id: 'review123', input: mockInput })).rejects.toThrow('Failed to update review: Unknown error');
    });
  });
});
