import { GraphQLError, GraphQLResolveInfo } from 'graphql';

// Mock the dependencies
jest.mock('../../../../src/models/booking.model');
jest.mock('../../../../src/utils/transform-booking');
jest.mock('../../../../src/utils/convert-mongoose');

import { BookingModel } from '../../../../src/models/booking.model';
import { transformBookings } from '../../../../src/utils/transform-booking';
import { convertMongooseArrayToPlain } from '../../../../src/utils/convert-mongoose';
import { getBookingsByCheckInDate } from '../../../../src/resolvers/queries/booking/get-book-checkin-date';
import { Booking, BookingStatus } from '../../../../src/generated';

const mockBookingModel = BookingModel as jest.Mocked<typeof BookingModel>;
const mockTransformBookings = transformBookings as jest.MockedFunction<typeof transformBookings>;
const mockConvertMongooseArrayToPlain = convertMongooseArrayToPlain as jest.MockedFunction<typeof convertMongooseArrayToPlain>;

// Mock GraphQL context objects
const mockParent = {};
const mockContext = {};
const mockInfo = {} as GraphQLResolveInfo;

describe('getBookingsByCheckInDate resolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('successful execution', () => {
    it('should fetch and return transformed bookings for valid check-in date', async () => {
      // Arrange
      const checkInDate = '2024-01-15';
      const mockBookingsData = [
        { 
          _id: '1', 
          hotelId: 'hotel123', 
          createdAt: new Date('2024-01-01'),
          userId: 'user1',
          roomId: 'room1',
          checkInDate: new Date('2024-01-15T10:00:00.000Z'),
          checkOutDate: new Date('2024-01-17T10:00:00.000Z'),
          adults: 2,
          children: 1,
          status: 'booked'
        },
        { 
          _id: '2', 
          hotelId: 'hotel456', 
          createdAt: new Date('2024-01-02'),
          userId: 'user2',
          roomId: 'room2',
          checkInDate: new Date('2024-01-15T14:00:00.000Z'),
          checkOutDate: new Date('2024-01-18T14:00:00.000Z'),
          adults: 1,
          children: 0,
          status: 'booked'
        }
      ];
      const mockPlainBookings = [
        { 
          _id: '1', 
          hotelId: 'hotel123', 
          createdAt: new Date('2024-01-01'),
          userId: 'user1',
          roomId: 'room1',
          checkInDate: new Date('2024-01-15T10:00:00.000Z'),
          checkOutDate: new Date('2024-01-17T10:00:00.000Z'),
          adults: 2,
          children: 1,
          status: 'booked'
        },
        { 
          _id: '2', 
          hotelId: 'hotel456', 
          createdAt: new Date('2024-01-02'),
          userId: 'user2',
          roomId: 'room2',
          checkInDate: new Date('2024-01-15T14:00:00.000Z'),
          checkOutDate: new Date('2024-01-18T14:00:00.000Z'),
          adults: 1,
          children: 0,
          status: 'booked'
        }
      ];
      const mockTransformedBookings: Booking[] = [
        { 
          id: '1', 
          hotelId: 'hotel123', 
          createdAt: '2024-01-01T00:00:00.000Z',
          userId: 'user1',
          roomId: 'room1',
          checkInDate: '2024-01-15T10:00:00.000Z',
          checkOutDate: '2024-01-17T10:00:00.000Z',
          adults: 2,
          children: 1,
          status: BookingStatus.Booked
        } as Booking,
        { 
          id: '2', 
          hotelId: 'hotel456', 
          createdAt: '2024-01-02T00:00:00.000Z',
          userId: 'user2',
          roomId: 'room2',
          checkInDate: '2024-01-15T14:00:00.000Z',
          checkOutDate: '2024-01-18T14:00:00.000Z',
          adults: 1,
          children: 0,
          status: BookingStatus.Booked
        } as Booking
      ];

      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockBookingsData)
      });
      mockConvertMongooseArrayToPlain.mockReturnValue(mockPlainBookings);
      (mockTransformBookings as jest.Mock).mockResolvedValue(mockTransformedBookings);

      // Act
      const result = await getBookingsByCheckInDate(mockParent, { checkInDate }, mockContext, mockInfo);

      // Assert
      expect(mockBookingModel.find).toHaveBeenCalled();
      const findCall = (mockBookingModel.find as jest.Mock).mock.calls[0][0];
      expect(findCall.checkInDate.$gte).toBeInstanceOf(Date);
      expect(findCall.checkInDate.$lte).toBeInstanceOf(Date);

      const startDate = findCall.checkInDate.$gte;
      const endDate = findCall.checkInDate.$lte;
      expect(startDate.getDate()).toBe(15);
      expect(startDate.getMonth()).toBe(0); // January
      expect(startDate.getFullYear()).toBe(2024);
      expect(endDate.getDate()).toBe(15);
      expect(endDate.getMonth()).toBe(0); // January
      expect(endDate.getFullYear()).toBe(2024);

      expect(result).toEqual(mockTransformedBookings);
    });

    it('should handle empty results for valid check-in date', async () => {
      // Arrange
      const checkInDate = '2024-01-15';
      const mockBookingsData: any[] = [];
      const mockPlainBookings: any[] = [];
      const mockTransformedBookings: Booking[] = [];

      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockBookingsData)
      });
      mockConvertMongooseArrayToPlain.mockReturnValue(mockPlainBookings);
      (mockTransformBookings as jest.Mock).mockResolvedValue(mockTransformedBookings);

      // Act
      const result = await getBookingsByCheckInDate(mockParent, { checkInDate }, mockContext, mockInfo);

      // Assert
      expect(mockBookingModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockTransformedBookings);
    });

    it('should handle single booking result', async () => {
      // Arrange
      const checkInDate = '2024-01-15';
      const mockBookingsData = [
        { 
          _id: '1', 
          hotelId: 'hotel123', 
          createdAt: new Date('2024-01-01'),
          userId: 'user1',
          roomId: 'room1',
          checkInDate: new Date('2024-01-15T10:00:00.000Z'),
          checkOutDate: new Date('2024-01-17T10:00:00.000Z'),
          adults: 2,
          children: 1,
          status: 'booked'
        }
      ];
      const mockPlainBookings = [
        { 
          _id: '1', 
          hotelId: 'hotel123', 
          createdAt: new Date('2024-01-01'),
          userId: 'user1',
          roomId: 'room1',
          checkInDate: new Date('2024-01-15T10:00:00.000Z'),
          checkOutDate: new Date('2024-01-17T10:00:00.000Z'),
          adults: 2,
          children: 1,
          status: 'booked'
        }
      ];
      const mockTransformedBookings: Booking[] = [
        { 
          id: '1', 
          hotelId: 'hotel123', 
          createdAt: '2024-01-01T00:00:00.000Z',
          userId: 'user1',
          roomId: 'room1',
          checkInDate: '2024-01-15T10:00:00.000Z',
          checkOutDate: '2024-01-17T10:00:00.000Z',
          adults: 2,
          children: 1,
          status: BookingStatus.Booked
        } as Booking
      ];

      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockBookingsData)
      });
      mockConvertMongooseArrayToPlain.mockReturnValue(mockPlainBookings);
      (mockTransformBookings as jest.Mock).mockResolvedValue(mockTransformedBookings);

      // Act
      const result = await getBookingsByCheckInDate(mockParent, { checkInDate }, mockContext, mockInfo);

      // Assert
      expect(mockBookingModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockTransformedBookings);
    });

    it('should handle date with time components', async () => {
      // Arrange
      const checkInDate = '2024-01-15T10:30:00.000Z';
      const mockBookingsData: any[] = [];
      const mockPlainBookings: any[] = [];
      const mockTransformedBookings: Booking[] = [];

      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockBookingsData)
      });
      mockConvertMongooseArrayToPlain.mockReturnValue(mockPlainBookings);
      (mockTransformBookings as jest.Mock).mockResolvedValue(mockTransformedBookings);

      // Act
      const result = await getBookingsByCheckInDate(mockParent, { checkInDate }, mockContext, mockInfo);

      // Assert
      expect(mockBookingModel.find).toHaveBeenCalled();
      expect(result).toEqual(mockTransformedBookings);
    });
  });

  describe('error handling', () => {
    it('should throw GraphQLError for invalid date format', async () => {
      // Arrange
      const checkInDate = 'invalid-date';

      // Act & Assert
      await expect(getBookingsByCheckInDate(mockParent, { checkInDate }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(getBookingsByCheckInDate(mockParent, { checkInDate }, mockContext, mockInfo))
        .rejects.toThrow('Invalid check-in date format');
    });

    it('should throw GraphQLError for empty date string', async () => {
      // Arrange
      const checkInDate = '';

      // Act & Assert
      await expect(getBookingsByCheckInDate(mockParent, { checkInDate }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(getBookingsByCheckInDate(mockParent, { checkInDate }, mockContext, mockInfo))
        .rejects.toThrow('Invalid check-in date format');
    });

    it('should throw GraphQLError for undefined date', async () => {
      // Arrange
      const checkInDate = undefined as any;

      // Act & Assert
      await expect(getBookingsByCheckInDate(mockParent, { checkInDate }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(getBookingsByCheckInDate(mockParent, { checkInDate }, mockContext, mockInfo))
        .rejects.toThrow('Invalid check-in date format');
    });

    it('should re-throw GraphQLError when validation fails', async () => {
      // Arrange
      const invalidDate = 'invalid-date';

      // Act & Assert
      await expect(getBookingsByCheckInDate(mockParent, { checkInDate: invalidDate }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(getBookingsByCheckInDate(mockParent, { checkInDate: invalidDate }, mockContext, mockInfo))
        .rejects.toThrow('Invalid check-in date format');
    });

    it('should re-throw GraphQLError when database query throws GraphQLError', async () => {
      // Arrange
      const checkInDate = '2024-01-01';
      const mockGraphQLError = new GraphQLError('Custom GraphQL error', {
        extensions: { code: 'CUSTOM_ERROR' }
      });

      // Mock the database query to throw a GraphQLError to test the re-throw branch
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(mockGraphQLError)
      });

      // Act & Assert
      await expect(getBookingsByCheckInDate(mockParent, { checkInDate }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(getBookingsByCheckInDate(mockParent, { checkInDate }, mockContext, mockInfo))
        .rejects.toThrow('Custom GraphQL error');
      
      // Verify the error has the same extensions
      try {
        await getBookingsByCheckInDate(mockParent, { checkInDate }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).extensions?.code).toBe('CUSTOM_ERROR');
      }
    });

    it('should throw GraphQLError when database query fails', async () => {
      // Arrange
      const checkInDate = '2024-01-01';
      const mockError = new Error('Database error');

      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(mockError)
      });

      // Act & Assert
      await expect(getBookingsByCheckInDate(mockParent, { checkInDate }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(getBookingsByCheckInDate(mockParent, { checkInDate }, mockContext, mockInfo))
        .rejects.toThrow('Failed to fetch bookings by check-in date');
    });

    it('should throw GraphQLError when transformation fails', async () => {
      // Arrange
      const checkInDate = '2024-01-01';
      const mockBookingsData = [
        { 
          _id: '1', 
          hotelId: 'hotel123', 
          createdAt: new Date('2024-01-01'),
          userId: 'user1',
          roomId: 'room1',
          checkInDate: new Date('2024-01-01'),
          checkOutDate: new Date('2024-01-03'),
          adults: 2,
          children: 1,
          status: 'booked'
        }
      ];

      // Mock the database query to succeed but make convertMongooseArrayToPlain throw an error
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockBookingsData)
      });
      
      // Mock convertMongooseArrayToPlain to throw a non-GraphQLError to test the else branch
      mockConvertMongooseArrayToPlain.mockImplementation(() => {
        throw new Error('Conversion failed');
      });

      // Act & Assert
      await expect(getBookingsByCheckInDate(mockParent, { checkInDate }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(getBookingsByCheckInDate(mockParent, { checkInDate }, mockContext, mockInfo))
        .rejects.toThrow('Failed to fetch bookings by check-in date');
    });

    it('should throw GraphQLError when database operation fails with non-GraphQLError', async () => {
      // Arrange
      const checkInDate = '2024-01-01';
      const mockError = new Error('Database operation failed');

      // Mock the database query to throw a non-GraphQLError to test the else branch
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(mockError)
      });

      // Act & Assert
      await expect(getBookingsByCheckInDate(mockParent, { checkInDate }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(getBookingsByCheckInDate(mockParent, { checkInDate }, mockContext, mockInfo))
        .rejects.toThrow('Failed to fetch bookings by check-in date');
    });
  });
});
