import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { createBooking } from '../../../../src/resolvers/mutations/booking';
import { BookingModel } from '../../../../src/models/booking.model';
import { Response } from '../../../../src/generated';

jest.mock('../../../../src/models/booking.model');

const mockBookingModel = BookingModel as jest.Mocked<typeof BookingModel>;
const mockParent = {};
const mockContext = {};
const mockInfo = {} as GraphQLResolveInfo;
const createBookingResolver = createBooking;

describe('createBooking resolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const validInput = {
    adults: 2,
    children: 1,
    checkInDate: '2030-02-01',
    checkOutDate: '2030-02-03',
    hotelId: 'hotel123',
    roomId: 'room123',
    userId: 'user123'
  };

  describe('successful execution', () => {
    it('should create booking successfully with valid input', async () => {
      mockBookingModel.create.mockResolvedValue([{ _id: 'mock-id' }] as unknown as ReturnType<typeof mockBookingModel.create>);
      
      const result = await createBookingResolver(mockParent, { input: validInput }, mockContext, mockInfo);
      
      expect(mockBookingModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ ...validInput, status: 'booked' })
      );
      expect(result).toBe(Response.Success);
    });

    it('should handle minimum valid input', async () => {
      const minInput = { ...validInput, adults: 1, children: 0, checkOutDate: '2030-02-02' };
      mockBookingModel.create.mockResolvedValue([{ _id: 'mock-id' }] as unknown as ReturnType<typeof mockBookingModel.create>);
      
      const result = await createBookingResolver(mockParent, { input: minInput }, mockContext, mockInfo);
      expect(result).toBe(Response.Success);
    });

    it('should handle boundary conditions (adults=1, children=0)', async () => {
      const boundaryInput = { ...validInput, adults: 1, children: 0, checkOutDate: '2030-02-02' };
      mockBookingModel.create.mockResolvedValue([{ _id: 'mock-id' }] as unknown as ReturnType<typeof mockBookingModel.create>);
      
      const result = await createBookingResolver(mockParent, { input: boundaryInput }, mockContext, mockInfo);
      expect(result).toBe(Response.Success);
    });
  });

  describe('validation errors', () => {
    it('should throw error when check-out date is before check-in date', async () => {
      const invalidInput = { ...validInput, checkInDate: '2024-02-03', checkOutDate: '2024-02-01' };
      
      await expect(createBookingResolver(mockParent, { input: invalidInput }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
    });

    it('should throw error when check-in date is in the past', async () => {
      const pastInput = { ...validInput, checkInDate: '2020-02-01', checkOutDate: '2020-02-03' };
      
      await expect(createBookingResolver(mockParent, { input: pastInput }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
    });

    it('should throw error when adults count is 0', async () => {
      const invalidInput = { ...validInput, adults: 0, children: 1 };
      
      await expect(createBookingResolver(mockParent, { input: invalidInput }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
    });

    it('should throw error when children count is negative', async () => {
      const invalidInput = { ...validInput, adults: 2, children: -1 };
      
      await expect(createBookingResolver(mockParent, { input: invalidInput }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
    });
  });

  describe('database errors', () => {
    it('should handle generic errors and convert to GraphQLError', async () => {
      const mockError = new Error('Database connection failed');
      mockBookingModel.create.mockRejectedValue(mockError);

      await expect(createBookingResolver(mockParent, { input: validInput }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
    });

    it('should handle Mongoose validation errors', async () => {
      const mockValidationError = new Error('Validation failed');
      mockValidationError.name = 'ValidationError';
      mockBookingModel.create.mockRejectedValue(mockValidationError);

      await expect(createBookingResolver(mockParent, { input: validInput }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
    });

    it('should handle unknown errors', async () => {
      const mockUnknownError = 'Unknown error string';
      mockBookingModel.create.mockRejectedValue(mockUnknownError);

      await expect(createBookingResolver(mockParent, { input: validInput }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);
    });
  });
});
