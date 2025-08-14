import { GraphQLError } from 'graphql';
import { deleteHotel } from '../../../../src/resolvers/mutations/hotel/delete-hotel';
import { HotelModel } from '../../../../src/models';

jest.mock('../../../../src/models', () => ({
  HotelModel: {
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

const mockHotelModel = HotelModel as jest.Mocked<typeof HotelModel>;

describe('deleteHotel', () => {
  const mockContext = {};
  const mockInfo = {} as any;

  const existingHotel = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Test Hotel',
    stars: 4,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a hotel successfully', async () => {
    mockHotelModel.findById.mockResolvedValue(existingHotel as any);
    mockHotelModel.findByIdAndDelete.mockResolvedValue(existingHotel as any);

    const result = await (deleteHotel as any)({}, { hotelId: '507f1f77bcf86cd799439011' }, mockContext, mockInfo);

    expect(mockHotelModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    expect(mockHotelModel.findByIdAndDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');

    expect(result).toEqual({
      success: true,
      message: 'Hotel deleted successfully',
    });
  });

  it('should return false when hotel not found', async () => {
    mockHotelModel.findById.mockResolvedValue(null);

    const result = await (deleteHotel as any)({}, { hotelId: 'nonexistent-id' }, mockContext, mockInfo);

    expect(result).toEqual({
      success: false,
      message: 'Hotel not found',
    });
  });

  it('should return false when findByIdAndDelete returns null', async () => {
    mockHotelModel.findById.mockResolvedValue(existingHotel as any);
    mockHotelModel.findByIdAndDelete.mockResolvedValue(null);

    const result = await (deleteHotel as any)({}, { hotelId: '507f1f77bcf86cd799439011' }, mockContext, mockInfo);

    expect(result).toEqual({
      success: false,
      message: 'Failed to delete hotel',
    });
  });

  it('should return false when findByIdAndDelete returns undefined', async () => {
    mockHotelModel.findById.mockResolvedValue(existingHotel as any);
    mockHotelModel.findByIdAndDelete.mockResolvedValue(undefined);

    const result = await (deleteHotel as any)({}, { hotelId: '507f1f77bcf86cd799439011' }, mockContext, mockInfo);

    expect(result).toEqual({
      success: false,
      message: 'Failed to delete hotel',
    });
  });

  it('should throw error when findById fails', async () => {
    mockHotelModel.findById.mockRejectedValue(new Error('Database error'));

    await expect((deleteHotel as any)({}, { hotelId: '507f1f77bcf86cd799439011' }, mockContext, mockInfo)).rejects.toThrow(GraphQLError);
  });

  it('should throw error when findByIdAndDelete operation fails', async () => {
    mockHotelModel.findById.mockResolvedValue(existingHotel as any);
    mockHotelModel.findByIdAndDelete.mockRejectedValue(new Error('Delete failed'));

    await expect((deleteHotel as any)({}, { hotelId: '507f1f77bcf86cd799439011' }, mockContext, mockInfo)).rejects.toThrow(GraphQLError);
  });

  it('should handle hotel with different ID formats', async () => {
    const hotelWithStringId = {
      _id: 'string-id-123',
      name: 'String ID Hotel',
      stars: 3,
    };

    mockHotelModel.findById.mockResolvedValue(hotelWithStringId as any);
    mockHotelModel.findByIdAndDelete.mockResolvedValue(hotelWithStringId as any);

    const result = await (deleteHotel as any)({}, { hotelId: 'string-id-123' }, mockContext, mockInfo);

    expect(mockHotelModel.findById).toHaveBeenCalledWith('string-id-123');
    expect(mockHotelModel.findByIdAndDelete).toHaveBeenCalledWith('string-id-123');

    expect(result).toEqual({
      success: true,
      message: 'Hotel deleted successfully',
    });
  });
});
