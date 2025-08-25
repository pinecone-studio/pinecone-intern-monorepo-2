import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { updateBooking } from '../../../../src/resolvers/mutations/booking';
import { BookingModel } from '../../../../src/models/booking.model';
import { BookingStatus, Response } from '../../../../src/generated';

// Mock the dependencies
jest.mock('../../../../src/models/booking.model');

const mockBookingModel = BookingModel as jest.Mocked<typeof BookingModel>;

// Mock GraphQL context objects
const mockParent = {};
const mockContext = {};
const mockInfo = {} as GraphQLResolveInfo;

// Get the resolver function
const updateBookingResolver = updateBooking;

describe('updateBooking resolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('successful execution', () => {
    it('should update booking successfully with valid input', async () => {
      // Arrange
      const validId = '507f1f77bcf86cd799439011';
      const input = {
        checkInDate: '2024-02-01',
        checkOutDate: '2024-02-03',
        adults: 2,
        children: 1
      };
      const mockUpdatedBooking = { id: validId, ...input, updatedAt: new Date() };

      mockBookingModel.findByIdAndUpdate.mockResolvedValue(mockUpdatedBooking);

      // Act
      const result = await updateBookingResolver(mockParent, { updateBookingId: validId, input }, mockContext, mockInfo);

      // Assert
      expect(mockBookingModel.findByIdAndUpdate).toHaveBeenCalledWith(
        validId,
        expect.objectContaining({
          ...input,
          updatedAt: expect.any(Date)
        }),
        { new: true }
      );
      expect(result).toBe(Response.Success);
    });

    it('should update booking with status change', async () => {
      // Arrange
      const validId = '507f1f77bcf86cd799439011';
      const input = {
        status: BookingStatus.Cancelled,
        checkInDate: '2024-02-01',
        checkOutDate: '2024-02-03'
      };
      const mockUpdatedBooking = { id: validId, ...input, updatedAt: new Date() };

      mockBookingModel.findByIdAndUpdate.mockResolvedValue(mockUpdatedBooking);

      // Act
      const result = await updateBookingResolver(mockParent, { updateBookingId: validId, input }, mockContext, mockInfo);

      // Assert
      expect(result).toBe(Response.Success);
    });
  });

  describe('booking not found', () => {
    it('should throw error when booking does not exist', async () => {
      // Arrange
      const validId = '507f1f77bcf86cd799439011';
      const input = { checkInDate: '2024-02-01', checkOutDate: '2024-02-03' };

      mockBookingModel.findByIdAndUpdate.mockResolvedValue(null);

      // Act & Assert
      await expect(updateBookingResolver(mockParent, { updateBookingId: validId, input }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);

      try {
        await updateBookingResolver(mockParent, { updateBookingId: validId, input }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('Booking not found');
        expect((error as GraphQLError).extensions?.code).toBe('BOOKING_NOT_FOUND');
      }
    });
  });

  describe('parameter validation', () => {
    it('should throw error when updateBookingId is missing', async () => {
      // Arrange
      const input = { checkInDate: '2024-02-01', checkOutDate: '2024-02-03' };

      // Act & Assert
      await expect(updateBookingResolver(mockParent, { input }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);

      try {
        await updateBookingResolver(mockParent, { input }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('updateBookingId is required');
        expect((error as GraphQLError).extensions?.code).toBe('MISSING_REQUIRED_PARAMETER');
      }
    });

    it('should throw error when input is missing', async () => {
      // Arrange
      const validId = '507f1f77bcf86cd799439011';

      // Act & Assert
      await expect(updateBookingResolver(mockParent, { updateBookingId: validId }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);

      try {
        await updateBookingResolver(mockParent, { updateBookingId: validId }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('input is required');
        expect((error as GraphQLError).extensions?.code).toBe('MISSING_REQUIRED_PARAMETER');
      }
    });
  });

  describe('error handling', () => {
    it('should re-throw GraphQLError when it occurs', async () => {
      // Arrange
      const validId = '507f1f77bcf86cd799439011';
      const input = { checkInDate: '2024-02-01', checkOutDate: '2024-02-03' };
      const graphQLError = new GraphQLError('Custom GraphQL error', {
        extensions: { code: 'CUSTOM_ERROR' }
      });

      mockBookingModel.findByIdAndUpdate.mockRejectedValue(graphQLError);

      // Act & Assert
      await expect(updateBookingResolver(mockParent, { updateBookingId: validId, input }, mockContext, mockInfo))
        .rejects.toThrow(graphQLError);
    });

    it('should handle generic errors and convert to GraphQLError', async () => {
      // Arrange
      const validId = '507f1f77bcf86cd799439011';
      const input = { checkInDate: '2024-02-01', checkOutDate: '2024-02-03' };
      const genericError = new Error('Database connection failed');

      mockBookingModel.findByIdAndUpdate.mockRejectedValue(genericError);

      // Act & Assert
      await expect(updateBookingResolver(mockParent, { updateBookingId: validId, input }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);

      try {
        await updateBookingResolver(mockParent, { updateBookingId: validId, input }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('Cannot update booking');
        expect((error as GraphQLError).extensions?.code).toBe('BOOKING_UPDATE_FAILED');
      }
    });
  });
});
