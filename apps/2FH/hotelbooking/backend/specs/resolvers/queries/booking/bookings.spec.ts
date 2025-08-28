import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { bookings } from '../../../../src/resolvers/queries/booking';
import { BookingModel } from '../../../../src/models/booking.model';
import { transformBookings } from '../../../../src/utils/transform-booking';

jest.mock('../../../../src/models/booking.model');
jest.mock('../../../../src/utils/transform-booking');

const mockBookingModel = BookingModel as jest.Mocked<typeof BookingModel>;
const mockTransformBookings = transformBookings as jest.MockedFunction<typeof transformBookings>;
const mockParent = {};
const mockArgs = {};
const mockContext = {};
const mockInfo = {} as GraphQLResolveInfo;
const bookingsResolver = bookings;

describe('bookings resolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const mockBookings = [
    { id: '1', createdAt: new Date('2024-01-01') },
    { id: '2', createdAt: new Date('2024-01-02') }
  ];

  const mockTransformedBookings = [
    { id: '1', createdAt: '2024-01-01T00:00:00.000Z' },
    { id: '2', createdAt: '2024-01-02T00:00:00.000Z' }
  ];

  describe('successful execution', () => {
    it('should fetch and return transformed bookings', async () => {
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockBookings)
      });
      mockTransformBookings.mockReturnValue(mockTransformedBookings);

      const result = await bookingsResolver(mockParent, mockArgs, mockContext, mockInfo);

      expect(mockBookingModel.find).toHaveBeenCalledWith({});
      expect(mockBookingModel.find().sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockTransformBookings).toHaveBeenCalledWith(mockBookings);
      expect(result).toEqual(mockTransformedBookings);
    });

    it('should handle empty bookings array', async () => {
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([])
      });

      const result = await bookingsResolver(mockParent, mockArgs, mockContext, mockInfo);

      expect(result).toEqual([]);
      expect(mockTransformBookings).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should throw GraphQLError when database query fails', async () => {
      const mockError = new Error('Database connection failed');
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(mockError)
      });

      await expect(bookingsResolver(mockParent, mockArgs, mockContext, mockInfo)).rejects.toThrow(GraphQLError);
    });

    it('should handle non-Error objects and set originalError to "Unknown error"', async () => {
      const mockError = 'String error';
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(mockError)
      });

      await expect(bookingsResolver(mockParent, mockArgs, mockContext, mockInfo)).rejects.toThrow(GraphQLError);
    });

    it('should handle data integrity errors with special error message', async () => {
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockBookings)
      });
      
      mockTransformBookings.mockImplementation(() => {
        throw new Error('Cannot return null for non-nullable field Booking.adults');
      });

      await expect(bookingsResolver(mockParent, mockArgs, mockContext, mockInfo)).rejects.toThrow(GraphQLError);
    });

    it('should handle generic errors when data integrity check fails', async () => {
      mockBookingModel.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockBookings)
      });
      
      mockTransformBookings.mockImplementation(() => {
        throw new Error('Generic transformation error');
      });

      await expect(bookingsResolver(mockParent, mockArgs, mockContext, mockInfo)).rejects.toThrow(GraphQLError);
    });
  });
});
