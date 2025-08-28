import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { getBookingsByUserId } from '../../../../src/resolvers/queries/booking';
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
const getBookingsByUserIdResolver = getBookingsByUserId;

// Use constant to avoid no-secrets linting error
const ERROR_CODE = 'FETCH_FAILED';

describe('getBookingsByUserId resolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('successful execution', () => {
    it('should fetch and return transformed bookings for valid user ID', async () => {
      // Arrange
      const userId = 'user123';
      const mockBookings = [
        { id: '1', userId: 'user123', createdAt: new Date('2024-01-01') },
        { id: '2', userId: 'user123', createdAt: new Date('2024-01-02') }
      ];
      const mockTransformedBookings = [
        { id: '1', userId: 'user123', createdAt: '2024-01-01T00:00:00.000Z' },
        { id: '2', userId: 'user123', createdAt: '2024-01-02T00:00:00.000Z' }
      ];

      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockBookings)
      });
      mockTransformBookings.mockReturnValue(mockTransformedBookings);

      // Act
      const result = await getBookingsByUserIdResolver(mockParent, { userId }, mockContext, mockInfo);

      // Assert
      expect(mockBookingModel.find).toHaveBeenCalledWith({ userId });
      expect(mockBookingModel.find().sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockTransformBookings).toHaveBeenCalledWith(mockBookings);
      expect(result).toEqual(mockTransformedBookings);
    });

    it('should handle empty results for valid user ID', async () => {
      // Arrange
      const userId = 'user123';
      const mockBookings: unknown[] = [];
      const mockTransformedBookings: unknown[] = [];

      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockBookings)
      });
      mockTransformBookings.mockReturnValue(mockTransformedBookings);

      // Act
      const result = await getBookingsByUserIdResolver(mockParent, { userId }, mockContext, mockInfo);

      // Assert
      expect(result).toEqual(mockTransformedBookings);
      expect(mockTransformBookings).toHaveBeenCalledWith(mockBookings);
    });

    it('should handle single booking result', async () => {
      // Arrange
      const userId = 'user456';
      const mockBookings = [{ id: '1', userId: 'user456', createdAt: new Date('2024-01-01') }];
      const mockTransformedBookings = [{ id: '1', userId: 'user456', createdAt: '2024-01-01T00:00:00.000Z' }];

      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockBookings)
      });
      mockTransformBookings.mockReturnValue(mockTransformedBookings);

      // Act
      const result = await getBookingsByUserIdResolver(mockParent, { userId }, mockContext, mockInfo);

      // Assert
      expect(result).toEqual(mockTransformedBookings);
    });
  });

  describe('error handling', () => {
    it('should throw GraphQLError when database query fails', async () => {
      // Arrange
      const userId = 'user123';
      const mockError = new Error('Database connection failed');
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(mockError)
      });

      // Act & Assert
      await expect(getBookingsByUserIdResolver(mockParent, { userId }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);

      try {
        await getBookingsByUserIdResolver(mockParent, { userId }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('Failed to fetch bookings by user ID');
        expect((error as GraphQLError).extensions?.code).toBe(ERROR_CODE);
        expect((error as GraphQLError).extensions?.originalError).toBe('Database connection failed');
      }
    });

    it('should handle non-Error objects and set originalError to "Unknown error"', async () => {
      // Arrange
      const userId = 'user123';
      const mockError = 'String error';
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(mockError)
      });

      // Act & Assert
      await expect(getBookingsByUserIdResolver(mockParent, { userId }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);

      try {
        await getBookingsByUserIdResolver(mockParent, { userId }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).extensions?.originalError).toBe('Unknown error');
      }
    });
  });
});
