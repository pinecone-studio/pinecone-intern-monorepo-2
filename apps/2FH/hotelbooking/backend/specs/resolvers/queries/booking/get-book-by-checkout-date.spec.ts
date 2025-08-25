import { GraphQLError } from 'graphql';
import { BookingModel } from '../../../../src/models/booking.model';
import { transformBookings } from '../../../../src/utils/transform-booking';
import { convertMongooseArrayToPlain } from '../../../../src/utils/convert-mongoose';
import { getBookingsByCheckOutDate } from '../../../../src/resolvers/queries/booking/get-book-by-checkout-date';
import { Booking, BookingStatus } from '../../../../src/generated';

// Mock the dependencies
jest.mock('../../../../src/models/booking.model');
jest.mock('../../../../src/utils/transform-booking');
jest.mock('../../../../src/utils/convert-mongoose');

const mockBookingModel = BookingModel as jest.Mocked<typeof BookingModel>;
const mockTransformBookings = transformBookings as jest.MockedFunction<typeof transformBookings>;
const mockConvertMongooseArrayToPlain = convertMongooseArrayToPlain as jest.MockedFunction<typeof convertMongooseArrayToPlain>;

// Mock GraphQL context objects
const mockParent = {};
const mockContext = {};
const mockInfo = {} as any;

describe('getBookingsByCheckOutDate resolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('successful execution', () => {
    it('should fetch and return transformed bookings for valid date', async () => {
      // Arrange
      const checkOutDate = '2024-01-15';
      const mockBookingsData = [
        { 
          _id: '1', 
          hotelId: 'hotel123', 
          createdAt: new Date('2024-01-01'),
          userId: 'user1',
          roomId: 'room1',
          checkInDate: new Date('2024-01-10'),
          checkOutDate: new Date('2024-01-15'),
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
          checkInDate: new Date('2024-01-10'),
          checkOutDate: new Date('2024-01-15'),
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
          checkInDate: '2024-01-10T00:00:00.000Z',
          checkOutDate: '2024-01-15T00:00:00.000Z',
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
      const result = await getBookingsByCheckOutDate(mockParent, { checkOutDate }, mockContext, mockInfo);

      // Assert
      expect(mockBookingModel.find).toHaveBeenCalled();
      const findCall = (mockBookingModel.find as jest.Mock).mock.calls[0][0];
      expect(findCall.checkOutDate.$gte).toBeInstanceOf(Date);
      expect(findCall.checkOutDate.$lte).toBeInstanceOf(Date);
      
      // Check that the dates are for the same day
      const startDate = findCall.checkOutDate.$gte;
      const endDate = findCall.checkOutDate.$lte;
      expect(startDate.getDate()).toBe(15);
      expect(startDate.getMonth()).toBe(0); // January
      expect(startDate.getFullYear()).toBe(2024);
      expect(endDate.getDate()).toBe(15);
      expect(endDate.getMonth()).toBe(0); // January
      expect(endDate.getFullYear()).toBe(2024);
      expect(mockConvertMongooseArrayToPlain).toHaveBeenCalledWith(mockBookingsData);
      expect(mockTransformBookings).toHaveBeenCalledWith(mockPlainBookings);
      expect(result).toEqual(mockTransformedBookings);
    });

    it('should handle empty results', async () => {
      // Arrange
      const checkOutDate = '2024-01-15';
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([])
      });
      mockConvertMongooseArrayToPlain.mockReturnValue([]);
      (mockTransformBookings as jest.Mock).mockResolvedValue([]);

      // Act
      const result = await getBookingsByCheckOutDate(mockParent, { checkOutDate }, mockContext, mockInfo);

      // Assert
      expect(result).toEqual([]);
      expect(mockTransformBookings).toHaveBeenCalledWith([]);
    });

    it('should handle single booking result', async () => {
      // Arrange
      const checkOutDate = '2024-01-15';
      const mockBookingsData = [
        { 
          _id: '1', 
          hotelId: 'hotel123', 
          createdAt: new Date('2024-01-01'),
          userId: 'user1',
          roomId: 'room1',
          checkInDate: new Date('2024-01-10'),
          checkOutDate: new Date('2024-01-15'),
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
          checkInDate: new Date('2024-01-10'),
          checkOutDate: new Date('2024-01-15'),
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
          checkInDate: '2024-01-10T00:00:00.000Z',
          checkOutDate: '2024-01-15T00:00:00.000Z',
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
      const result = await getBookingsByCheckOutDate(mockParent, { checkOutDate }, mockContext, mockInfo);

      // Assert
      expect(result).toEqual(mockTransformedBookings);
    });

    it('should handle date with time components', async () => {
      // Arrange
      const checkOutDate = '2024-01-15T14:30:00.000Z';
      const mockBookingsData = [
        { 
          _id: '1', 
          hotelId: 'hotel123', 
          createdAt: new Date('2024-01-01'),
          userId: 'user1',
          roomId: 'room1',
          checkInDate: new Date('2024-01-10'),
          checkOutDate: new Date('2024-01-15T14:30:00.000Z'),
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
          checkInDate: new Date('2024-01-10'),
          checkOutDate: new Date('2024-01-15T14:30:00.000Z'),
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
          checkInDate: '2024-01-10T00:00:00.000Z',
          checkOutDate: '2024-01-15T14:30:00.000Z',
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
      const result = await getBookingsByCheckOutDate(mockParent, { checkOutDate }, mockContext, mockInfo);

      // Assert
      expect(mockBookingModel.find).toHaveBeenCalled();
      const findCall = (mockBookingModel.find as jest.Mock).mock.calls[0][0];
      expect(findCall.checkOutDate.$gte).toBeInstanceOf(Date);
      expect(findCall.checkOutDate.$lte).toBeInstanceOf(Date);
      
      // Check that the dates are for the same day
      const startDate = findCall.checkOutDate.$gte;
      const endDate = findCall.checkOutDate.$lte;
      expect(startDate.getDate()).toBe(15);
      expect(startDate.getMonth()).toBe(0); // January
      expect(startDate.getFullYear()).toBe(2024);
      expect(endDate.getDate()).toBe(15);
      expect(endDate.getMonth()).toBe(0); // January
      expect(endDate.getFullYear()).toBe(2024);
      expect(result).toEqual(mockTransformedBookings);
    });
  });

  describe('error handling', () => {
    it('should throw GraphQLError for invalid date format', async () => {
      // Arrange
      const invalidDate = 'invalid-date';

      // Act & Assert
      await expect(getBookingsByCheckOutDate(mockParent, { checkOutDate: invalidDate }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(getBookingsByCheckOutDate(mockParent, { checkOutDate: invalidDate }, mockContext, mockInfo))
        .rejects.toThrow('Invalid check-out date format');
    });

    it('should throw GraphQLError for empty date string', async () => {
      // Arrange
      const emptyDate = '';

      // Act & Assert
      await expect(getBookingsByCheckOutDate(mockParent, { checkOutDate: emptyDate }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(getBookingsByCheckOutDate(mockParent, { checkOutDate: emptyDate }, mockContext, mockInfo))
        .rejects.toThrow('Invalid check-out date format');
    });

    it('should throw GraphQLError for undefined date', async () => {
      // Arrange
      const undefinedDate = undefined as any;

      // Act & Assert
      await expect(getBookingsByCheckOutDate(mockParent, { checkOutDate: undefinedDate }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(getBookingsByCheckOutDate(mockParent, { checkOutDate: undefinedDate }, mockContext, mockInfo))
        .rejects.toThrow('Invalid check-out date format');
    });

    it('should throw GraphQLError when database query fails', async () => {
      // Arrange
      const checkOutDate = '2024-01-15';
      const mockError = new Error('Database error');
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(mockError)
      });

      // Act & Assert
      await expect(getBookingsByCheckOutDate(mockParent, { checkOutDate }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(getBookingsByCheckOutDate(mockParent, { checkOutDate }, mockContext, mockInfo))
        .rejects.toThrow('Failed to fetch bookings by check-out date');
    });

    it('should throw GraphQLError when transformation fails', async () => {
      // Arrange
      const checkOutDate = '2024-01-15';
      const mockBookingsData = [
        { 
          _id: '1', 
          hotelId: 'hotel123', 
          createdAt: new Date('2024-01-01'),
          userId: 'user1',
          roomId: 'room1',
          checkInDate: new Date('2024-01-10'),
          checkOutDate: new Date('2024-01-15'),
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
          checkInDate: new Date('2024-01-10'),
          checkOutDate: new Date('2024-01-15'),
          adults: 2,
          children: 1,
          status: 'booked'
        }
      ];

      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockBookingsData)
      });
      mockConvertMongooseArrayToPlain.mockReturnValue(mockPlainBookings);
      (mockTransformBookings as jest.Mock).mockRejectedValue(new Error('Transformation failed'));

      // Act & Assert
      await expect(getBookingsByCheckOutDate(mockParent, { checkOutDate }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(getBookingsByCheckOutDate(mockParent, { checkOutDate }, mockContext, mockInfo))
        .rejects.toThrow('Failed to fetch bookings by check-out date');
    });

    it('should handle unknown error type', async () => {
      // Arrange
      const checkOutDate = '2024-01-15';
      const mockError = 'String error';
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(mockError)
      });

      // Act & Assert
      await expect(getBookingsByCheckOutDate(mockParent, { checkOutDate }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
      
      await expect(getBookingsByCheckOutDate(mockParent, { checkOutDate }, mockContext, mockInfo))
        .rejects.toThrow('Failed to fetch bookings by check-out date');
    });
  });

  describe('date range creation', () => {
    it('should create correct date range for start of day', async () => {
      // Arrange
      const checkOutDate = '2024-01-15';
      const mockBookingsData: any[] = [];
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockBookingsData)
      });
      mockConvertMongooseArrayToPlain.mockReturnValue([]);
      (mockTransformBookings as jest.Mock).mockResolvedValue([]);

      // Act
      await getBookingsByCheckOutDate(mockParent, { checkOutDate }, mockContext, mockInfo);

      // Assert - Use more flexible date comparison
      expect(mockBookingModel.find).toHaveBeenCalled();
      const findCall = (mockBookingModel.find as jest.Mock).mock.calls[0][0];
      expect(findCall.checkOutDate.$gte).toBeInstanceOf(Date);
      expect(findCall.checkOutDate.$lte).toBeInstanceOf(Date);
      
      // Check that the dates are for the same day
      const startDate = findCall.checkOutDate.$gte;
      const endDate = findCall.checkOutDate.$lte;
      expect(startDate.getDate()).toBe(15);
      expect(startDate.getMonth()).toBe(0); // January
      expect(startDate.getFullYear()).toBe(2024);
      expect(endDate.getDate()).toBe(15);
      expect(endDate.getMonth()).toBe(0); // January
      expect(endDate.getFullYear()).toBe(2024);
    });

    it('should create correct date range for end of day', async () => {
      // Arrange
      const checkOutDate = '2024-12-31';
      const mockBookingsData: any[] = [];
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockBookingsData)
      });
      mockConvertMongooseArrayToPlain.mockReturnValue([]);
      (mockTransformBookings as jest.Mock).mockResolvedValue([]);

      // Act
      await getBookingsByCheckOutDate(mockParent, { checkOutDate }, mockContext, mockInfo);

      // Assert - Use more flexible date comparison
      expect(mockBookingModel.find).toHaveBeenCalled();
      const findCall = (mockBookingModel.find as jest.Mock).mock.calls[0][0];
      expect(findCall.checkOutDate.$gte).toBeInstanceOf(Date);
      expect(findCall.checkOutDate.$lte).toBeInstanceOf(Date);
      
      // Check that the dates are for the same day
      const startDate = findCall.checkOutDate.$gte;
      const endDate = findCall.checkOutDate.$lte;
      expect(startDate.getDate()).toBe(31);
      expect(startDate.getMonth()).toBe(11); // December
      expect(startDate.getFullYear()).toBe(2024);
      expect(endDate.getDate()).toBe(31);
      expect(endDate.getMonth()).toBe(11); // December
      expect(endDate.getFullYear()).toBe(2024);
    });
  });
});
