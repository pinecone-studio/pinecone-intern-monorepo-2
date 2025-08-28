import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { getBookingsByCheckInDate } from '../../../../src/resolvers/queries/booking';
import { BookingModel } from '../../../../src/models/booking.model';

import { transformBookings } from '../../../../src/utils/transform-booking';

// Mock the dependencies
jest.mock('../../../../src/models/booking.model');
jest.mock('../../../../src/utils/transform-booking');

const mockBookingModel = BookingModel as jest.Mocked<typeof BookingModel>;
const mockTransformBookings = transformBookings as jest.MockedFunction<typeof transformBookings>;

// Mock GraphQL context objects
const mockParent = {};
const mockContext = {};
const mockInfo = {} as GraphQLResolveInfo;

// Get the resolver function
const getBookingsByCheckInDateResolver = getBookingsByCheckInDate;

describe('getBookingsByCheckInDate resolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('successful execution', () => {
    it('should fetch and return transformed bookings for valid date', async () => {
      // Arrange
      const checkInDate = '2024-01-15';
      const mockBookings = [
        { id: '1', checkInDate: new Date('2024-01-15T10:00:00Z') },
        { id: '2', checkInDate: new Date('2024-01-15T15:00:00Z') }
      ];
      const mockTransformedBookings = [
        { id: '1', checkInDate: '2024-01-15T10:00:00.000Z' },
        { id: '2', checkInDate: '2024-01-15T15:00:00.000Z' }
      ];

      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockBookings)
      });
      mockTransformBookings.mockReturnValue(mockTransformedBookings);

      // Act
      const result = await getBookingsByCheckInDateResolver(mockParent, { checkInDate }, mockContext, mockInfo);

      // Assert
      expect(mockBookingModel.find).toHaveBeenCalledWith({
        checkInDate: {
          $gte: expect.any(Date),
          $lte: expect.any(Date)
        }
      });
      expect(mockTransformBookings).toHaveBeenCalledWith(mockBookings);
      expect(result).toEqual(mockTransformedBookings);
    });

    it('should handle empty results', async () => {
      // Arrange
      const checkInDate = '2024-01-15';
      const mockBookings: unknown[] = [];
      const mockTransformedBookings: unknown[] = [];

      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockBookings)
      });
      mockTransformBookings.mockReturnValue(mockTransformedBookings);

      // Act
      const result = await getBookingsByCheckInDateResolver(mockParent, { checkInDate }, mockContext, mockInfo);

      // Assert
      expect(result).toEqual(mockTransformedBookings);
    });
  });

  describe('date validation', () => {
    it('should throw error for invalid date format', async () => {
      // Arrange
      const invalidDate = 'invalid-date';

      // Act & Assert
      await expect(getBookingsByCheckInDateResolver(mockParent, { checkInDate: invalidDate }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);

      try {
        await getBookingsByCheckInDateResolver(mockParent, { checkInDate: invalidDate }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('Invalid check-in date format');
        expect((error as GraphQLError).extensions?.code).toBe('INVALID_DATE_FORMAT');
      }
    });

    it('should throw error for empty date string', async () => {
      // Arrange
      const emptyDate = '';

      // Act & Assert
      await expect(getBookingsByCheckInDateResolver(mockParent, { checkInDate: emptyDate }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
    });
  });

  describe('error handling', () => {
    it('should throw GraphQLError when database query fails', async () => {
      // Arrange
      const checkInDate = '2024-01-15';
      const mockError = new Error('Database connection failed');
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(mockError)
      });

      // Act & Assert
      await expect(getBookingsByCheckInDateResolver(mockParent, { checkInDate }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);

      try {
        await getBookingsByCheckInDateResolver(mockParent, { checkInDate }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('Failed to fetch bookings by check-in date');
        expect((error as GraphQLError).extensions?.code).toBe('CHECKIN_DATE_BOOKINGS_FETCH_FAILED');
      }
    });

    it('should handle unknown error types', async () => {
      // Arrange
      const checkInDate = '2024-01-15';
      const mockUnknownError = 'Unknown error string';
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(mockUnknownError)
      });

      // Act & Assert
      await expect(getBookingsByCheckInDateResolver(mockParent, { checkInDate }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);

      try {
        await getBookingsByCheckInDateResolver(mockParent, { checkInDate }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('Failed to fetch bookings by check-in date');
        expect((error as GraphQLError).extensions?.code).toBe('CHECKIN_DATE_BOOKINGS_FETCH_FAILED');
        expect((error as GraphQLError).extensions?.originalError).toBe('Unknown error');
      }
    });
  });
});
