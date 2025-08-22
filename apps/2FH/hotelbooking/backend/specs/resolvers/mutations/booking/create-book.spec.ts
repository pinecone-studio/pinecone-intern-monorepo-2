import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { createBooking } from '../../../../src/resolvers/mutations/booking';
import { BookingModel } from '../../../../src/models/booking.model';

// Mock the dependencies
jest.mock('../../../../src/models/booking.model');

const mockBookingModel = BookingModel as jest.Mocked<typeof BookingModel>;

// Mock GraphQL context objects
const mockParent = {};
const mockContext = {};
const mockInfo = {} as GraphQLResolveInfo;

// Get the resolver function
const createBookingResolver = createBooking;

describe('createBooking resolver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  describe('successful execution', () => {
    it('should create booking successfully with valid input', async () => {
      // Arrange
      const input = {
        adults: 2,
        children: 1,
        checkInDate: '2030-02-01',
        checkOutDate: '2030-02-03',
        hotelId: 'hotel123',
        roomId: 'room123',
        userId: 'user123'
      };

      mockBookingModel.create.mockResolvedValue([{ 
        _id: 'mock-id',
        userId: 'user123',
        hotelId: 'hotel123',
        roomId: 'room123',
        checkInDate: '2030-02-01',
        checkOutDate: '2030-02-03',
        adults: 2,
        children: 1,
        status: 'booked',
        createdAt: new Date(),
        updatedAt: new Date()
      }] as unknown as ReturnType<typeof mockBookingModel.create>);

      // Act
      const result = await createBookingResolver(mockParent, { input }, mockContext, mockInfo);

      // Assert
      expect(mockBookingModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          adults: 2,
          children: 1,
          checkInDate: '2030-02-01',
          checkOutDate: '2030-02-03',
          hotelId: 'hotel123',
          roomId: 'room123',
          userId: 'user123',
          status: 'booked'
        })
      );
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('hotelId', 'hotel123');
      expect(result).toHaveProperty('roomId', 'room123');
      expect(result).toHaveProperty('userId', 'user123');
      expect(result).toHaveProperty('status', 'BOOKED');
    });

    it('should handle minimum valid input', async () => {
      // Arrange
      const input = {
        adults: 1,
        children: 0,
        checkInDate: '2030-02-01',
        checkOutDate: '2030-02-02',
        hotelId: 'hotel456',
        roomId: 'room456',
        userId: 'user456'
      };

      mockBookingModel.create.mockResolvedValue([{ 
        _id: 'mock-id',
        userId: 'user456',
        hotelId: 'hotel456',
        roomId: 'room456',
        checkInDate: '2030-02-01',
        checkOutDate: '2030-02-02',
        adults: 1,
        children: 0,
        status: 'booked',
        createdAt: new Date(),
        updatedAt: new Date()
      }] as unknown as ReturnType<typeof mockBookingModel.create>);

      // Act
      const result = await createBookingResolver(mockParent, { input }, mockContext, mockInfo);

      // Assert
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('hotelId', 'hotel456');
      expect(result).toHaveProperty('roomId', 'room456');
      expect(result).toHaveProperty('userId', 'user456');
      expect(result).toHaveProperty('status', 'BOOKED');
    });

    it('should handle single document response from Mongoose', async () => {
      // Arrange
      const input = {
        adults: 2,
        children: 1,
        checkInDate: '2030-02-01',
        checkOutDate: '2030-02-03',
        hotelId: 'hotel123',
        roomId: 'room123',
        userId: 'user123'
      };

      const singleDocument = { 
        _id: 'mock-id',
        userId: 'user123',
        hotelId: 'hotel123',
        roomId: 'room123',
        checkInDate: '2030-02-01',
        checkOutDate: '2030-02-03',
        adults: 2,
        children: 1,
        status: 'booked',
        createdAt: new Date(),
        updatedAt: new Date(),
        toObject: jest.fn().mockReturnValue({
          _id: 'mock-id',
          userId: 'user123',
          hotelId: 'hotel123',
          roomId: 'room123',
          checkInDate: '2030-02-01',
          checkOutDate: '2030-02-03',
          adults: 2,
          children: 1,
          status: 'booked',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      };

      mockBookingModel.create.mockResolvedValue(singleDocument as unknown as ReturnType<typeof mockBookingModel.create>);

      // Act
      const result = await createBookingResolver(mockParent, { input }, mockContext, mockInfo);

      // Assert
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('hotelId', 'hotel123');
      expect(result).toHaveProperty('roomId', 'room123');
      expect(result).toHaveProperty('userId', 'user123');
      expect(result).toHaveProperty('status', 'BOOKED');
    });

    it('should handle document without toObject method (fallback)', async () => {
      // Arrange
      const input = {
        adults: 2,
        children: 1,
        checkInDate: '2030-02-01',
        checkOutDate: '2030-02-03',
        hotelId: 'hotel123',
        roomId: 'room123',
        userId: 'user123'
      };

      const documentWithoutToObject = { 
        _id: 'mock-id',
        id: 'mock-id', // Fallback id
        userId: 'user123',
        hotelId: 'hotel123',
        roomId: 'room123',
        checkInDate: '2030-02-01',
        checkOutDate: '2030-02-03',
        adults: 2,
        children: 1,
        status: 'booked',
        createdAt: new Date(),
        updatedAt: new Date()
        // No toObject method
      };

      mockBookingModel.create.mockResolvedValue(documentWithoutToObject as unknown as ReturnType<typeof mockBookingModel.create>);

      // Act
      const result = await createBookingResolver(mockParent, { input }, mockContext, mockInfo);

      // Assert
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('hotelId', 'hotel123');
      expect(result).toHaveProperty('roomId', 'room123');
      expect(result).toHaveProperty('userId', 'user123');
      expect(result).toHaveProperty('status', 'BOOKED');
    });
  });

  describe('validation errors', () => {
    it('should throw error when check-out date is before check-in date', async () => {
      // Arrange
      const input = {
        checkInDate: '2024-02-03',
        checkOutDate: '2024-02-01',
        adults: 2,
        children: 0,
        hotelId: 'hotel123',
        roomId: 'room456',
        userId: 'user789'
      };

      // Act & Assert
      await expect(createBookingResolver(mockParent, { input }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);

      try {
        await createBookingResolver(mockParent, { input }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('Check-out date must be after check-in date');
        expect((error as GraphQLError).extensions?.code).toBe('INVALID_DATE_RANGE');
      }
    });

    it('should throw error when adults count is less than 1', async () => {
      // Arrange
      const input = {
        checkInDate: '2030-02-01',
        checkOutDate: '2030-02-03',
        adults: 0,
        children: 0,
        hotelId: 'hotel123',
        roomId: 'room456',
        userId: 'user789'
      };

      // Act & Assert
      await expect(createBookingResolver(mockParent, { input }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);

      try {
        await createBookingResolver(mockParent, { input }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('At least one adult is required');
        expect((error as GraphQLError).extensions?.code).toBe('INVALID_GUEST_COUNT');
      }
    });

    it('should throw error when children count is negative', async () => {
      // Arrange
      const input = {
        checkInDate: '2030-02-01',
        checkOutDate: '2030-02-03',
        adults: 2,
        children: -1,
        hotelId: 'hotel123',
        roomId: 'room456',
        userId: 'user789'
      };

      // Act & Assert
      await expect(createBookingResolver(mockParent, { input }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);

      try {
        await createBookingResolver(mockParent, { input }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('Children count cannot be negative');
        expect((error as GraphQLError).extensions?.code).toBe('INVALID_GUEST_COUNT');
      }
    });

    it('should throw error when check-in date is in the past', async () => {
      // Arrange
      const input = {
        checkInDate: '2020-02-01',
        checkOutDate: '2020-02-03',
        adults: 2,
        children: 0,
        hotelId: 'hotel123',
        roomId: 'room456',
        userId: 'user789'
      };

      // Act & Assert
      await expect(createBookingResolver(mockParent, { input }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);

      try {
        await createBookingResolver(mockParent, { input }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('Check-in date cannot be in the past');
        expect((error as GraphQLError).extensions?.code).toBe('INVALID_DATE');
      }
    });
  });

  describe('database errors', () => {
    it('should handle generic errors and convert to GraphQLError', async () => {
      // Arrange
      const input = {
        adults: 2,
        children: 1,
        checkInDate: '2030-02-01',
        checkOutDate: '2030-02-03',
        hotelId: 'hotel123',
        roomId: 'room123',
        userId: 'user123'
      };

      const mockError = new Error('Database connection failed');
      mockBookingModel.create.mockRejectedValue(mockError);

      // Act & Assert
      await expect(createBookingResolver(mockParent, { input }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);

      try {
        await createBookingResolver(mockParent, { input }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('Failed to create booking: Database connection failed');
        expect((error as GraphQLError).extensions?.code).toBe('BOOKING_CREATION_FAILED');
        expect((error as GraphQLError).extensions?.originalError).toBe('Database connection failed');
      }
    });

    it('should handle Mongoose validation errors', async () => {
      // Arrange
      const input = {
        adults: 2,
        children: 1,
        checkInDate: '2030-02-01',
        checkOutDate: '2030-02-03',
        hotelId: 'hotel123',
        roomId: 'room123',
        userId: 'user123'
      };

      const mockValidationError = new Error('Validation failed');
      mockValidationError.name = 'ValidationError';
      mockBookingModel.create.mockRejectedValue(mockValidationError);

      // Act & Assert
      await expect(createBookingResolver(mockParent, { input }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);

      try {
        await createBookingResolver(mockParent, { input }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('Validation failed: Validation failed');
        expect((error as GraphQLError).extensions?.code).toBe('VALIDATION_ERROR');
      }
    });

    it('should handle GraphQLError by re-throwing it', async () => {
      // Arrange
      const input = {
        adults: 2,
        children: 1,
        checkInDate: '2030-02-01',
        checkOutDate: '2030-02-03',
        hotelId: 'hotel123',
        roomId: 'room123',
        userId: 'user123'
      };

      const mockGraphQLError = new GraphQLError('Custom validation error', {
        extensions: { code: 'CUSTOM_ERROR' }
      });
      mockBookingModel.create.mockRejectedValue(mockGraphQLError);

      // Act & Assert
      await expect(createBookingResolver(mockParent, { input }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);

      try {
        await createBookingResolver(mockParent, { input }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('Custom validation error');
        expect((error as GraphQLError).extensions?.code).toBe('CUSTOM_ERROR');
      }
    });

    it('should handle unknown errors', async () => {
      // Arrange
      const input = {
        adults: 2,
        children: 1,
        checkInDate: '2030-02-01',
        checkOutDate: '2030-02-03',
        hotelId: 'hotel123',
        roomId: 'room123',
        userId: 'user123'
      };

      const mockUnknownError = 'Unknown error string';
      mockBookingModel.create.mockRejectedValue(mockUnknownError);

      // Act & Assert
      await expect(createBookingResolver(mockParent, { input }, mockContext, mockInfo))
        .rejects.toThrow(GraphQLError);

      try {
        await createBookingResolver(mockParent, { input }, mockContext, mockInfo);
      } catch (error) {
        expect(error).toBeInstanceOf(GraphQLError);
        expect((error as GraphQLError).message).toBe('Failed to create booking: Unknown error');
        expect((error as GraphQLError).extensions?.code).toBe('BOOKING_CREATION_FAILED');
        expect((error as GraphQLError).extensions?.originalError).toBe('Unknown error');
      }
    });
  });
});
