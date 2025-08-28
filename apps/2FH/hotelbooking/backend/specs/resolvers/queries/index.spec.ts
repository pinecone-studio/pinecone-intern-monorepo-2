import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { bookings } from '../../../src/resolvers/queries/booking';
import { BookingModel } from '../../../src/models/booking.model';

import { transformBookings } from '../../../src/utils/transform-booking';

// Mock the dependencies
jest.mock('../../../src/models/booking.model');
jest.mock('../../../src/utils/transform-booking');

const mockBookingModel = BookingModel as jest.Mocked<typeof BookingModel>;
const mockTransformBookings = transformBookings as jest.MockedFunction<typeof transformBookings>;

// Mock GraphQL context objects
const mockParent = {};
const mockArgs = {};
const mockContext = {};
const mockInfo = {} as GraphQLResolveInfo;

// Get the resolver function
const bookingsResolver = bookings;

describe('bookings resolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('successful execution', () => {
    it('should fetch and return transformed bookings', async () => {
      // Arrange
      const mockBookings = [
        { id: '1', createdAt: new Date('2024-01-01') },
        { id: '2', createdAt: new Date('2024-01-02') }
      ];
      const mockTransformedBookings = [
        { id: '1', createdAt: '2024-01-01T00:00:00.000Z' },
        { id: '2', createdAt: '2024-01-02T00:00:00.000Z' }
      ];

      mockBookingModel.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockBookings)
      } as unknown as ReturnType<typeof mockBookingModel.find>);
      mockTransformBookings.mockReturnValue(mockTransformedBookings);

      // Act
      const result = await bookingsResolver(mockParent, mockArgs, mockContext, mockInfo);

      // Assert
      expect(mockBookingModel.find).toHaveBeenCalledWith({});
      expect(mockBookingModel.find().sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockTransformBookings).toHaveBeenCalledWith(mockBookings);
      expect(result).toEqual(mockTransformedBookings);
    });

    it('should return empty array when no bookings exist', async () => {
      // Arrange
      const mockBookings: unknown[] = [];
      const mockTransformedBookings: unknown[] = [];

      mockBookingModel.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockBookings)
      } as unknown as ReturnType<typeof mockBookingModel.find>);
      mockTransformBookings.mockReturnValue(mockTransformedBookings);

      // Act
      const result = await bookingsResolver(mockParent, mockArgs, mockContext, mockInfo);

      // Assert
      expect(result).toEqual(mockTransformedBookings);
    });
  });

  describe('error handling', () => {
    it('should throw GraphQLError when database query fails', async () => {
      // Arrange
      const mockError = new Error('Database connection failed');

      mockBookingModel.find.mockReturnValue({
        sort: jest.fn().mockRejectedValue(mockError)
      } as unknown as ReturnType<typeof mockBookingModel.find>);

      // Act & Assert
      await expect(bookingsResolver(mockParent, mockArgs, mockContext, mockInfo)).rejects.toThrow(GraphQLError);

      try {
        await bookingsResolver(mockParent, mockArgs, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('Failed to fetch bookings');
        expect((error as GraphQLError).extensions?.code).toBe('BOOKINGS_FETCH_FAILED');
      }
    });

    it('should handle generic errors and convert to GraphQLError', async () => {
      // Arrange
      const mockError = new Error('Unknown error occurred');

      mockBookingModel.find.mockReturnValue({
        sort: jest.fn().mockRejectedValue(mockError)
      } as unknown as ReturnType<typeof mockBookingModel.find>);

      // Act & Assert
      await expect(bookingsResolver(mockParent, mockArgs, mockContext, mockInfo)).rejects.toThrow(GraphQLError);

      try {
        await bookingsResolver(mockParent, mockArgs, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('Failed to fetch bookings');
        expect((error as GraphQLError).extensions?.code).toBe('BOOKINGS_FETCH_FAILED');
      }
    });
  });
});
