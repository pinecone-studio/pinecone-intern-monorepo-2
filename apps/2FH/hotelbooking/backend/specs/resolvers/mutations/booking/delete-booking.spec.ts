import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { deleteBooking } from '../../../../src/resolvers/mutations/booking';
import { BookingModel } from '../../../../src/models/booking.model';
import { Response } from '../../../../src/generated';

// Debug: Check what's being imported
console.log('deleteBooking imported:', typeof deleteBooking);
console.log('deleteBooking value:', deleteBooking);

// Mock the dependencies
jest.mock('../../../../src/models/booking.model');

const mockBookingModel = BookingModel as jest.Mocked<typeof BookingModel>;

// Mock GraphQL context objects
const mockParent = {};
const mockContext = {};
const mockInfo = {} as GraphQLResolveInfo;

// Get the resolver function
const deleteBookingResolver = deleteBooking;

describe('deleteBooking resolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('successful execution', () => {
    it('should delete booking successfully with valid ID', async () => {
      // Arrange
      const validId = '507f1f77bcf86cd799439011';
      const mockBooking = { id: validId, createdAt: new Date('2024-01-01') };

      mockBookingModel.findById.mockResolvedValue(mockBooking);
      mockBookingModel.findByIdAndDelete.mockResolvedValue(mockBooking);

      // Act
      const result = await deleteBookingResolver(mockParent, { id: validId }, mockContext, mockInfo);

      // Assert
      expect(mockBookingModel.findById).toHaveBeenCalledWith(validId);
      expect(mockBookingModel.findByIdAndDelete).toHaveBeenCalledWith(validId);
      expect(result).toBe(Response.Success);
    });
  });

  describe('validation errors', () => {
    it('should throw error for empty ID string', async () => {
      // Arrange
      const emptyId = '';

      // Act & Assert
      await expect(deleteBookingResolver(mockParent, { id: emptyId }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);

      try {
        await deleteBookingResolver(mockParent, { id: emptyId }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('Invalid booking ID');
        expect((error as GraphQLError).extensions?.code).toBe('INVALID_ID');
      }
    });

    it('should throw error for non-string ID', async () => {
      // Arrange
      const nonStringId = 123 as unknown as string;

      // Act & Assert
      await expect(deleteBookingResolver(mockParent, { id: nonStringId }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
    });
  });

  describe('booking not found', () => {
    it('should throw error when booking does not exist', async () => {
      // Arrange
      const validId = '507f1f77bcf86cd799439011';
      mockBookingModel.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(deleteBookingResolver(mockParent, { id: validId }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);

      try {
        await deleteBookingResolver(mockParent, { id: validId }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('Booking not found');
        expect((error as GraphQLError).extensions?.code).toBe('BOOKING_NOT_FOUND');
      }
    });
  });

  describe('database errors', () => {
    it('should throw GraphQLError when database query fails', async () => {
      // Arrange
      const validId = '507f1f77bcf86cd799439011';
      const mockError = new Error('Database connection failed');
      mockBookingModel.findById.mockRejectedValue(mockError);

      // Act & Assert
      await expect(deleteBookingResolver(mockParent, { id: validId }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);

      try {
        await deleteBookingResolver(mockParent, { id: validId }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('Failed to delete booking');
        expect((error as GraphQLError).extensions?.code).toBe('BOOKING_DELETION_FAILED');
        expect((error as GraphQLError).extensions?.originalError).toBe('Database connection failed');
      }
    });

    it('should handle Mongoose validation errors', async () => {
      // Arrange
      const validId = '507f1f77bcf86cd799439011';
      const mockError = new Error('Validation failed');
      mockError.name = 'ValidationError';
      mockBookingModel.findById.mockRejectedValue(mockError);

      // Act & Assert
      await expect(deleteBookingResolver(mockParent, { id: validId }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);

      try {
        await deleteBookingResolver(mockParent, { id: validId }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('Validation failed: Validation failed');
        expect((error as GraphQLError).extensions?.code).toBe('VALIDATION_ERROR');
      }
    });

    it('should handle unknown error types', async () => {
      // Arrange
      const validId = '507f1f77bcf86cd799439011';
      const mockUnknownError = 'Unknown error string';
      mockBookingModel.findById.mockRejectedValue(mockUnknownError);

      // Act & Assert
      await expect(deleteBookingResolver(mockParent, { id: validId }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);

      try {
        await deleteBookingResolver(mockParent, { id: validId }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('Failed to delete booking');
        expect((error as GraphQLError).extensions?.code).toBe('BOOKING_DELETION_FAILED');
        expect((error as GraphQLError).extensions?.originalError).toBe('Unknown error');
      }
    });
  });
});
