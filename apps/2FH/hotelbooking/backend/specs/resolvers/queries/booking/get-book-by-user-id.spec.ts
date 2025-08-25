import { GraphQLError, GraphQLResolveInfo } from 'graphql';

// Mock the dependencies
jest.mock('../../../../src/models/booking.model');
jest.mock('../../../../src/utils/transform-booking');
jest.mock('../../../../src/utils/convert-mongoose');

import { BookingModel } from '../../../../src/models/booking.model';
import { transformBookings } from '../../../../src/utils/transform-booking';
import { convertMongooseArrayToPlain } from '../../../../src/utils/convert-mongoose';
import { getBookingsByUserId } from '../../../../src/resolvers/queries/booking/get-book-by-user-id';
import { Booking, BookingStatus } from '../../../../src/generated';

const mockBookingModel = BookingModel as jest.Mocked<typeof BookingModel>;
const mockTransformBookings = transformBookings as jest.MockedFunction<typeof transformBookings>;
const mockConvertMongooseArrayToPlain = convertMongooseArrayToPlain as jest.MockedFunction<typeof convertMongooseArrayToPlain>;

// Mock GraphQL context objects
const mockParent = {};
const mockContext = {};
const mockInfo = {} as GraphQLResolveInfo;

describe('getBookingsByUserId resolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('successful execution', () => {
    it('should fetch and return transformed bookings for valid user ID', async () => {
      // Arrange
      const userId = 'user123';
      const mockBookingsData = [
        { 
          _id: '1', 
          hotelId: 'hotel123', 
          createdAt: new Date('2024-01-01'),
          userId: 'user123',
          roomId: 'room1',
          checkInDate: new Date('2024-01-01'),
          checkOutDate: new Date('2024-01-03'),
          adults: 2,
          children: 1,
          status: 'booked'
        },
        { 
          _id: '2', 
          hotelId: 'hotel456', 
          createdAt: new Date('2024-01-02'),
          userId: 'user123',
          roomId: 'room2',
          checkInDate: new Date('2024-01-02'),
          checkOutDate: new Date('2024-01-04'),
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
          userId: 'user123',
          roomId: 'room1',
          checkInDate: new Date('2024-01-01'),
          checkOutDate: new Date('2024-01-03'),
          adults: 2,
          children: 1,
          status: 'booked'
        },
        { 
          _id: '2', 
          hotelId: 'hotel456', 
          createdAt: new Date('2024-01-02'),
          userId: 'user123',
          roomId: 'room2',
          checkInDate: new Date('2024-01-02'),
          checkOutDate: new Date('2024-01-04'),
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
          userId: 'user123',
          roomId: 'room1',
          checkInDate: '2024-01-01T00:00:00.000Z',
          checkOutDate: '2024-01-03T00:00:00.000Z',
          adults: 2,
          children: 1,
          status: BookingStatus.Booked
        } as Booking,
        { 
          id: '2', 
          hotelId: 'hotel456', 
          createdAt: '2024-01-02T00:00:00.000Z',
          userId: 'user123',
          roomId: 'room2',
          checkInDate: '2024-01-02T00:00:00.000Z',
          checkOutDate: '2024-01-04T00:00:00.000Z',
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
      const result = await getBookingsByUserId(mockParent, { userId }, mockContext, mockInfo);

      // Assert
      expect(mockBookingModel.find).toHaveBeenCalledWith({ userId });
      expect(result).toEqual(mockTransformedBookings);
    });

    it('should handle empty results for valid user ID', async () => {
      // Arrange
      const userId = 'user123';
      const mockBookingsData: any[] = [];
      const mockPlainBookings: any[] = [];
      const mockTransformedBookings: Booking[] = [];

      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockBookingsData)
      });
      mockConvertMongooseArrayToPlain.mockReturnValue(mockPlainBookings);
      (mockTransformBookings as jest.Mock).mockResolvedValue(mockTransformedBookings);

      // Act
      const result = await getBookingsByUserId(mockParent, { userId }, mockContext, mockInfo);

      // Assert
      expect(mockBookingModel.find).toHaveBeenCalledWith({ userId });
      expect(result).toEqual(mockTransformedBookings);
    });

    it('should handle single booking result', async () => {
      // Arrange
      const userId = 'user123';
      const mockBookingsData = [
        { 
          _id: '1', 
          hotelId: 'hotel123', 
          createdAt: new Date('2024-01-01'),
          userId: 'user123',
          roomId: 'room1',
          checkInDate: new Date('2024-01-01'),
          checkOutDate: new Date('2024-01-03'),
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
          userId: 'user123',
          roomId: 'room1',
          checkInDate: new Date('2024-01-01'),
          checkOutDate: new Date('2024-01-03'),
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
          userId: 'user123',
          roomId: 'room1',
          checkInDate: '2024-01-01T00:00:00.000Z',
          checkOutDate: '2024-01-03T00:00:00.000Z',
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
      const result = await getBookingsByUserId(mockParent, { userId }, mockContext, mockInfo);

      // Assert
      expect(mockBookingModel.find).toHaveBeenCalledWith({ userId });
      expect(result).toEqual(mockTransformedBookings);
    });
  });

  describe('error handling', () => {
    it('should throw GraphQLError when transformation fails', async () => {
      // Arrange
      const userId = 'user123';
      const mockBookingsData = [
        { 
          _id: '1', 
          hotelId: 'hotel123', 
          createdAt: new Date('2024-01-01'),
          userId: 'user123',
          roomId: 'room1',
          checkInDate: new Date('2024-01-01'),
          checkOutDate: new Date('2024-01-03'),
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
          userId: 'user123',
          roomId: 'room1',
          checkInDate: new Date('2024-01-01'),
          checkOutDate: new Date('2024-01-03'),
          adults: 2,
          children: 1,
          status: 'booked'
        }
      ];

      mockBookingModel.find = jest.fn().mockResolvedValue(mockBookingsData);
      mockConvertMongooseArrayToPlain.mockReturnValue(mockPlainBookings);
      (mockTransformBookings as jest.Mock).mockImplementation(() => {
        throw new Error('Transformation failed');
      });

      // Act & Assert
      await expect(getBookingsByUserId(mockParent, { userId }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(getBookingsByUserId(mockParent, { userId }, mockContext, mockInfo))
        .rejects.toThrow('Failed to fetch bookings by user ID');
    });

    it('should throw GraphQLError when database query fails', async () => {
      // Arrange
      const userId = 'user123';
      const mockError = new Error('Database error');

      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(mockError)
      });

      // Act & Assert
      await expect(getBookingsByUserId(mockParent, { userId }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(getBookingsByUserId(mockParent, { userId }, mockContext, mockInfo))
        .rejects.toThrow('Failed to fetch bookings by user ID');
    });
  });
});
