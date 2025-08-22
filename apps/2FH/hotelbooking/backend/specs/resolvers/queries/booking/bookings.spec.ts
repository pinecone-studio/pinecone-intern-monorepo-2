import { GraphQLError } from 'graphql';
import { bookings } from '../../../../src/resolvers/queries/booking/bookings';
import { BookingModel } from '../../../../src/models/booking.model';
import { transformBookings } from '../../../../src/utils/transform-booking';
import { convertMongooseArrayToPlain } from '../../../../src/utils/convert-mongoose';

// Mock the dependencies
jest.mock('../../../../src/models/booking.model');
jest.mock('../../../../src/utils/transform-booking');
jest.mock('../../../../src/utils/convert-mongoose');

const mockBookingModel = BookingModel as jest.Mocked<typeof BookingModel>;
const mockTransformBookings = transformBookings as jest.Mock;
const mockConvertMongooseArrayToPlain = convertMongooseArrayToPlain as jest.Mock;

// Mock console methods
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

describe('bookings resolver', () => {
  const mockParent = {};
  const mockContext = {};
  const mockInfo = {} as any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
  });

  describe('successful execution', () => {
    it('should return empty array when no bookings exist', async () => {
      // Arrange
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([])
        })
      });

      // Act
      const result = await bookings(mockParent, {}, mockContext, mockInfo);

      // Assert
      expect(result).toEqual([]);
      expect(mockBookingModel.find).toHaveBeenCalledWith({});
    });

    it('should return transformed bookings when they exist', async () => {
      // Arrange
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
      const mockPlainBookings = [
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
      const mockTransformedBookings = [
        {
          id: '1',
          hotelId: 'hotel123',
          createdAt: '2024-01-01T00:00:00.000Z',
          userId: 'user1',
          roomId: 'room1',
          checkInDate: '2024-01-01T00:00:00.000Z',
          checkOutDate: '2024-01-03T00:00:00.000Z',
          adults: 2,
          children: 1,
          status: 'BOOKED'
        }
      ];

      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockBookingsData)
        })
      });
      mockConvertMongooseArrayToPlain.mockReturnValue(mockPlainBookings);
      mockTransformBookings.mockResolvedValue(mockTransformedBookings);

      // Act
      const result = await bookings(mockParent, {}, mockContext, mockInfo);

      // Assert
      expect(result).toEqual(mockTransformedBookings);
      expect(mockConvertMongooseArrayToPlain).toHaveBeenCalledWith(mockBookingsData);
      expect(mockTransformBookings).toHaveBeenCalledWith(mockPlainBookings);
    });

    it('should handle empty results', async () => {
      // Arrange
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([])
        })
      });

      // Act
      const result = await bookings(mockParent, {}, mockContext, mockInfo);

      // Assert
      expect(result).toEqual([]);
      expect(mockConvertMongooseArrayToPlain).not.toHaveBeenCalled();
      expect(mockTransformBookings).not.toHaveBeenCalled();
    });

    it('should handle null results', async () => {
      // Arrange
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null)
        })
      });

      // Act
      const result = await bookings(mockParent, {}, mockContext, mockInfo);

      // Assert
      expect(result).toEqual([]);
      expect(mockConvertMongooseArrayToPlain).not.toHaveBeenCalled();
      expect(mockTransformBookings).not.toHaveBeenCalled();
    });

    it('should handle undefined results', async () => {
      // Arrange
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(undefined)
        })
      });

      // Act
      const result = await bookings(mockParent, {}, mockContext, mockInfo);

      // Assert
      expect(result).toEqual([]);
      expect(mockConvertMongooseArrayToPlain).not.toHaveBeenCalled();
      expect(mockTransformBookings).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle data integrity error with null field message', async () => {
      // Arrange
      const mockError = new Error('Cannot return null for non-nullable field');
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(mockError)
        })
      });

      // Act & Assert
      await expect(bookings(mockParent, {}, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(bookings(mockParent, {}, mockContext, mockInfo))
        .rejects.toThrow('Data integrity error: Some booking records have missing required fields. Please run data validation to identify and fix the issues.');
    });

    it('should handle data integrity error with undefined field message', async () => {
      // Arrange
      const mockError = new Error('Cannot return undefined for non-nullable field');
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(mockError)
        })
      });

      // Act & Assert
      await expect(bookings(mockParent, {}, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(bookings(mockParent, {}, mockContext, mockInfo))
        .rejects.toThrow('Failed to fetch bookings');
    });

    it('should handle generic database errors', async () => {
      // Arrange
      const mockError = new Error('Database operation failed');
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(mockError)
        })
      });

      // Act & Assert
      await expect(bookings(mockParent, {}, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(bookings(mockParent, {}, mockContext, mockInfo))
        .rejects.toThrow('Failed to fetch bookings');
    });

    it('should handle non-Error objects', async () => {
      // Arrange
      const mockError = 'String error';
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(mockError)
        })
      });

      // Act & Assert
      await expect(bookings(mockParent, {}, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(bookings(mockParent, {}, mockContext, mockInfo))
        .rejects.toThrow('Failed to fetch bookings');
    });

    it('should handle error during data transformation', async () => {
      // Arrange
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
      const mockPlainBookings = [
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

      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockBookingsData)
        })
      });
      mockConvertMongooseArrayToPlain.mockReturnValue(mockPlainBookings);
      mockTransformBookings.mockRejectedValue(new Error('Transformation failed'));

      // Act & Assert
      await expect(bookings(mockParent, {}, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(bookings(mockParent, {}, mockContext, mockInfo))
        .rejects.toThrow('Failed to fetch bookings');
    });

    it('should handle timeout error', async () => {
      // Arrange
      const mockError = new Error('Database query timed out after 15 seconds');
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(mockError)
        })
      });

      // Act & Assert
      await expect(bookings(mockParent, {}, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(bookings(mockParent, {}, mockContext, mockInfo))
        .rejects.toThrow('Database query timed out. Please try again.');
    });

    it('should handle operation timeout error', async () => {
      // Arrange
      const mockError = new Error('Database operation timed out');
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(mockError)
        })
      });

      // Act & Assert
      await expect(bookings(mockParent, {}, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(bookings(mockParent, {}, mockContext, mockInfo))
        .rejects.toThrow('Database operation timed out. Please try again.');
    });

    it('should handle timeout error with "timed out" in message', async () => {
      // Arrange
      const mockError = new Error('Something timed out');
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockRejectedValue(mockError)
        })
      });

      // Act & Assert
      await expect(bookings(mockParent, {}, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(bookings(mockParent, {}, mockContext, mockInfo))
        .rejects.toThrow('Database operation timed out. Please try again.');
    });
  });

  describe('sample data logging', () => {
    it('should log sample booking data when bookings exist', async () => {
      // Arrange
      const mockBookings = [
        {
          _id: 'booking1',
          adults: 2,
          children: 1,
          status: 'booked',
          toObject: () => ({
            _id: 'booking1',
            adults: 2,
            children: 1,
            status: 'booked'
          })
        }
      ];
      
      const mockPlainBookings = [
        {
          _id: 'booking1',
          adults: 2,
          children: 1,
          status: 'booked'
        }
      ];
      
      const mockTransformedBookings = [
        {
          id: 'booking1',
          adults: 2,
          children: 1,
          status: 'BOOKED'
        }
      ];
      
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockBookings)
        })
      });
      mockConvertMongooseArrayToPlain.mockReturnValue(mockPlainBookings);
      mockTransformBookings.mockResolvedValue(mockTransformedBookings);

      // Mock console.log to capture the output
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      const result = await bookings(mockParent, {}, mockContext, mockInfo);

      // Assert
      expect(result).toEqual(mockTransformedBookings);
      expect(consoleSpy).toHaveBeenCalled();

      // Restore console.log
      consoleSpy.mockRestore();
    });

    it('should handle empty bookings array with minimal logging', async () => {
      // Arrange
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([])
        })
      });

      // Mock console.log to capture the output
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      const result = await bookings(mockParent, {}, mockContext, mockInfo);

      // Assert
      expect(result).toEqual([]);
      // The code logs "No bookings found in database" for empty results
      expect(consoleSpy).toHaveBeenCalledWith('No bookings found in database');

      // Restore console.log
      consoleSpy.mockRestore();
    });
  });
});
