import { GraphQLError, GraphQLResolveInfo } from 'graphql';

// Mock the dependencies
jest.mock('../../../../src/models/booking.model');
jest.mock('../../../../src/utils/transform-booking');
jest.mock('../../../../src/utils/convert-mongoose');

import { BookingModel } from '../../../../src/models/booking.model';
import { transformBooking } from '../../../../src/utils/transform-booking';
import { convertMongooseArrayToPlain } from '../../../../src/utils/convert-mongoose';
import { getBooking } from '../../../../src/resolvers/queries/booking/get-booking';
import { Booking, BookingStatus } from '../../../../src/generated';

const mockBookingModel = BookingModel as jest.Mocked<typeof BookingModel>;
const mockTransformBooking = transformBooking as jest.MockedFunction<typeof transformBooking>;
const mockConvertMongooseArrayToPlain = convertMongooseArrayToPlain as jest.MockedFunction<typeof convertMongooseArrayToPlain>;

// Mock GraphQL context objects
const mockParent = {};
const mockContext = {};
const mockInfo = {} as GraphQLResolveInfo;

describe('getBooking resolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('successful execution', () => {
    it('should fetch and return transformed booking for valid ID', async () => {
      // Arrange
      const bookingId = '507f1f77bcf86cd799439011';
      const mockBookingData = { 
        _id: '507f1f77bcf86cd799439011', 
        hotelId: 'hotel123', 
        createdAt: new Date('2024-01-01'),
        userId: 'user1',
        roomId: 'room1',
        checkInDate: new Date('2024-01-01'),
        checkOutDate: new Date('2024-01-03'),
        adults: 2,
        children: 1,
        status: 'booked'
      };
      const mockPlainBooking = { 
        _id: '507f1f77bcf86cd799439011', 
        hotelId: 'hotel123', 
        createdAt: new Date('2024-01-01'),
        userId: 'user1',
        roomId: 'room1',
        checkInDate: new Date('2024-01-01'),
        checkOutDate: new Date('2024-01-03'),
        adults: 2,
        children: 1,
        status: 'booked'
      };
      const mockTransformedBooking: Booking = { 
        id: '507f1f77bcf86cd799439011', 
        hotelId: 'hotel123', 
        createdAt: '2024-01-01T00:00:00.000Z',
        userId: 'user1',
        roomId: 'room1',
        checkInDate: '2024-01-01T00:00:00.000Z',
        checkOutDate: '2024-01-03T00:00:00.000Z',
        adults: 2,
        children: 1,
        status: BookingStatus.Booked
      } as Booking;

      mockBookingModel.findById = jest.fn().mockResolvedValue(mockBookingData);
      mockConvertMongooseArrayToPlain.mockReturnValue([mockPlainBooking]);
      (mockTransformBooking as jest.Mock).mockReturnValue(mockTransformedBooking);

      // Act
      const result = await getBooking(mockParent, { id: bookingId }, mockContext, mockInfo);

      // Assert
      expect(mockBookingModel.findById).toHaveBeenCalledWith(bookingId);
      expect(result).toEqual(mockTransformedBooking);
    });

    it('should handle booking with zero adults and children', async () => {
      // Arrange
      const bookingId = '507f1f77bcf86cd799439011';
      const mockBookingData = { 
        _id: '507f1f77bcf86cd799439011', 
        hotelId: 'hotel123', 
        createdAt: new Date('2024-01-01'),
        userId: 'user1',
        roomId: 'room1',
        checkInDate: new Date('2024-01-01'),
        checkOutDate: new Date('2024-01-03'),
        adults: 0,
        children: 0,
        status: 'booked'
      };
      const mockPlainBooking = { 
        _id: '507f1f77bcf86cd799439011', 
        hotelId: 'hotel123', 
        createdAt: new Date('2024-01-01'),
        userId: 'user1',
        roomId: 'room1',
        checkInDate: new Date('2024-01-01'),
        checkOutDate: new Date('2024-01-03'),
        adults: 0,
        children: 0,
        status: 'booked'
      };
      const mockTransformedBooking: Booking = { 
        id: '507f1f77bcf86cd799439011', 
        hotelId: 'hotel123', 
        createdAt: '2024-01-01T00:00:00.000Z',
        userId: 'user1',
        roomId: 'room1',
        checkInDate: '2024-01-01T00:00:00.000Z',
        checkOutDate: '2024-01-03T00:00:00.000Z',
        adults: 0,
        children: 0,
        status: BookingStatus.Booked
      } as Booking;

      mockBookingModel.findById = jest.fn().mockResolvedValue(mockBookingData);
      mockConvertMongooseArrayToPlain.mockReturnValue([mockPlainBooking]);
      (mockTransformBooking as jest.Mock).mockReturnValue(mockTransformedBooking);

      // Act
      const result = await getBooking(mockParent, { id: bookingId }, mockContext, mockInfo);

      // Assert
      expect(mockBookingModel.findById).toHaveBeenCalledWith(bookingId);
      expect(result).toEqual(mockTransformedBooking);
    });
  });

  describe('error handling', () => {
    it('should throw GraphQLError for invalid ID format', async () => {
      // Arrange
      const invalidId = 'invalid-id';

      // Act & Assert
      await expect(getBooking(mockParent, { id: invalidId }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(getBooking(mockParent, { id: invalidId }, mockContext, mockInfo))
        .rejects.toThrow('Invalid booking ID format');
    });

    it('should throw GraphQLError for ID that is too short', async () => {
      // Arrange
      const shortId = '123';

      // Act & Assert
      await expect(getBooking(mockParent, { id: shortId }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(getBooking(mockParent, { id: shortId }, mockContext, mockInfo))
        .rejects.toThrow('Invalid booking ID format');
    });

    it('should throw GraphQLError for ID that is too long', async () => {
      // Arrange
      const longId = '507f1f77bcf86cd799439011123456789';

      // Act & Assert
      await expect(getBooking(mockParent, { id: longId }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(getBooking(mockParent, { id: longId }, mockContext, mockInfo))
        .rejects.toThrow('Invalid booking ID format');
    });

    it('should throw GraphQLError for ID with invalid characters', async () => {
      // Arrange
      const invalidCharId = '507f1f77bcf86cd79943901g';

      // Act & Assert
      await expect(getBooking(mockParent, { id: invalidCharId }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(getBooking(mockParent, { id: invalidCharId }, mockContext, mockInfo))
        .rejects.toThrow('Invalid booking ID format');
    });

    it('should throw GraphQLError when booking is not found', async () => {
      // Arrange
      const bookingId = '507f1f77bcf86cd799439011';

      mockBookingModel.findById = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(getBooking(mockParent, { id: bookingId }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(getBooking(mockParent, { id: bookingId }, mockContext, mockInfo))
        .rejects.toThrow('Booking not found');
    });

    it('should throw GraphQLError when database query fails', async () => {
      // Arrange
      const bookingId = '507f1f77bcf86cd799439011';
      const mockError = new Error('Database error');

      mockBookingModel.findById = jest.fn().mockRejectedValue(mockError);

      // Act & Assert
      await expect(getBooking(mockParent, { id: bookingId }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(getBooking(mockParent, { id: bookingId }, mockContext, mockInfo))
        .rejects.toThrow('Failed to fetch booking');
    });

    it('should throw GraphQLError when transformation fails', async () => {
      // Arrange
      const bookingId = '507f1f77bcf86cd799439011';
      const mockBookingData = { 
        _id: '507f1f77bcf86cd799439011', 
        hotelId: 'hotel123', 
        createdAt: new Date('2024-01-01'),
        userId: 'user1',
        roomId: 'room1',
        checkInDate: new Date('2024-01-01'),
        checkOutDate: new Date('2024-01-03'),
        adults: 2,
        children: 1,
        status: 'booked'
      };
      const mockPlainBooking = { 
        _id: '507f1f77bcf86cd799439011', 
        hotelId: 'hotel123', 
        createdAt: new Date('2024-01-01'),
        userId: 'user1',
        roomId: 'room1',
        checkInDate: new Date('2024-01-01'),
        checkOutDate: new Date('2024-01-03'),
        adults: 2,
        children: 1,
        status: 'booked'
      };

      mockBookingModel.findById = jest.fn().mockResolvedValue(mockBookingData);
      mockConvertMongooseArrayToPlain.mockReturnValue([mockPlainBooking]);
      (mockTransformBooking as jest.Mock).mockImplementation(() => {
        throw new Error('Transformation failed');
      });

      // Act & Assert
      await expect(getBooking(mockParent, { id: bookingId }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(getBooking(mockParent, { id: bookingId }, mockContext, mockInfo))
        .rejects.toThrow('Failed to fetch booking');
    });

    it('should re-throw GraphQLError when validation fails', async () => {
      // Arrange
      const invalidId = 'invalid-id';

      // Act & Assert
      await expect(getBooking(mockParent, { id: invalidId }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(getBooking(mockParent, { id: invalidId }, mockContext, mockInfo))
        .rejects.toThrow('Invalid booking ID format');
    });
  });
});
