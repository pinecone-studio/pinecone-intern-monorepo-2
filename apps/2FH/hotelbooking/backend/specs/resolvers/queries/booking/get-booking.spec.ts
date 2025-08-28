import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { getBooking } from '../../../../src/resolvers/queries/booking';
import { BookingModel } from '../../../../src/models/booking.model';

import { transformBooking } from '../../../../src/utils/transform-booking';

// Mock the dependencies
jest.mock('../../../../src/models/booking.model');
jest.mock('../../../../src/utils/transform-booking');

const mockBookingModel = BookingModel as jest.Mocked<typeof BookingModel>;
const mockTransformBooking = transformBooking as jest.MockedFunction<typeof transformBooking>;

// Mock GraphQL context objects
const mockParent = {};
const mockContext = {};
const mockInfo = {} as GraphQLResolveInfo;

// Get the resolver function
const getBookingResolver = getBooking;

describe('getBooking resolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('successful execution', () => {
    it('should fetch and return transformed booking for valid ID', async () => {
      // Arrange
      const validId = '507f1f77bcf86cd799439011';
      const mockBooking = { id: validId, createdAt: new Date('2024-01-01') };
      const mockTransformedBooking = { id: validId, createdAt: '2024-01-01T00:00:00.000Z' };

      mockBookingModel.findById.mockResolvedValue(mockBooking);
      mockTransformBooking.mockReturnValue(mockTransformedBooking);

      // Act
      const result = await getBookingResolver(mockParent, { id: validId }, mockContext, mockInfo);

      // Assert
      expect(mockBookingModel.findById).toHaveBeenCalledWith(validId);
      expect(mockTransformBooking).toHaveBeenCalledWith(mockBooking);
      expect(result).toEqual(mockTransformedBooking);
    });
  });

  describe('ID validation', () => {
    it('should throw error for invalid ID format', async () => {
      // Arrange
      const invalidId = 'invalid-id';

      // Act & Assert
      await expect(getBookingResolver(mockParent, { id: invalidId }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);

      try {
        await getBookingResolver(mockParent, { id: invalidId }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('Invalid booking ID format');
        expect((error as GraphQLError).extensions?.code).toBe('INVALID_ID_FORMAT');
      }
    });

    it('should throw error for ID with wrong length', async () => {
      // Arrange
      const shortId = '12345678901234567890123'; // 23 characters

      // Act & Assert
      await expect(getBookingResolver(mockParent, { id: shortId }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
    });

    it('should throw error for ID with invalid characters', async () => {
      // Arrange
      const invalidCharId = '507f1f77bcf86cd79943901g'; // 'g' is not hex

      // Act & Assert
      await expect(getBookingResolver(mockParent, { id: invalidCharId }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
    });
  });

  describe('booking not found', () => {
    it('should throw error when booking is not found', async () => {
      // Arrange
      const validId = '507f1f77bcf86cd799439011';
      mockBookingModel.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(getBookingResolver(mockParent, { id: validId }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);

      try {
        await getBookingResolver(mockParent, { id: validId }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('Booking not found');
        expect((error as GraphQLError).extensions?.code).toBe('BOOKING_NOT_FOUND');
      }
    });
  });

  describe('MongoDB ObjectId patterns', () => {
    it('should accept valid ObjectId with all zeros', async () => {
      // Arrange
      const allZerosId = '000000000000000000000000';
      const mockBooking = { id: allZerosId, createdAt: new Date('2024-01-01') };
      const mockTransformedBooking = { id: allZerosId, createdAt: '2024-01-01T00:00:00.000Z' };

      mockBookingModel.findById.mockResolvedValue(mockBooking);
      mockTransformBooking.mockReturnValue(mockTransformedBooking);

      // Act
      const result = await getBookingResolver(mockParent, { id: allZerosId }, mockContext, mockInfo);

      // Assert
      expect(result).toEqual(mockTransformedBooking);
    });

    it('should accept valid ObjectId with all f characters', async () => {
      // Arrange
      const allFsId = 'ffffffffffffffffffffffff';
      const mockBooking = { id: allFsId, createdAt: new Date('2024-01-01') };
      const mockTransformedBooking = { id: allFsId, createdAt: '2024-01-01T00:00:00.000Z' };

      mockBookingModel.findById.mockResolvedValue(mockBooking);
      mockTransformBooking.mockReturnValue(mockTransformedBooking);

      // Act
      const result = await getBookingResolver(mockParent, { id: allFsId }, mockContext, mockInfo);

      // Assert
      expect(result).toEqual(mockTransformedBooking);
    });
  });

  describe('error handling', () => {
    it('should handle generic errors and convert to GraphQLError', async () => {
      // Arrange
      const validId = '507f1f77bcf86cd799439011';
      const mockError = new Error('Database connection failed');
      
      mockBookingModel.findById.mockRejectedValue(mockError);

      // Act & Assert
      await expect(getBookingResolver(mockParent, { id: validId }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);

      try {
        await getBookingResolver(mockParent, { id: validId }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('Failed to fetch booking');
        expect((error as GraphQLError).extensions?.code).toBe('BOOKING_FETCH_FAILED');
      }
    });
  });
});
