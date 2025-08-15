import { GraphQLError } from 'graphql';
import { updateHotel } from '../../../../src/resolvers/mutations/hotel/update-hotel';
import { HotelModel } from '../../../../src/models';

jest.mock('../../../../src/models', () => ({
  HotelModel: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

const mockHotelModel = HotelModel as jest.Mocked<typeof HotelModel>;

describe('updateHotel', () => {
  const mockContext = {};
  const mockInfo = {} as any;

  const validUpdateInput = {
    name: 'Updated Hotel',
    stars: 5,
    rating: 9.0,
  };

  const existingHotel = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Original Hotel',
    stars: 4,
    rating: 8.0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('1. should update a hotel successfully', async () => {
    mockHotelModel.findById.mockResolvedValue(existingHotel as any);
    mockHotelModel.findByIdAndUpdate.mockResolvedValue({
      ...existingHotel,
      ...validUpdateInput,
    } as any);

    const result = await (updateHotel as any)({}, { id: '507f1f77bcf86cd799439011', hotel: validUpdateInput }, mockContext, mockInfo);

    expect(mockHotelModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    expect(mockHotelModel.findByIdAndUpdate).toHaveBeenCalledWith('507f1f77bcf86cd799439011', validUpdateInput, { new: true });

    expect(result).toEqual({
      success: true,
      message: 'Hotel updated successfully',
    });
  });

  it('2. should throw error when hotel not found', async () => {
    mockHotelModel.findById.mockResolvedValue(null);

    await expect((updateHotel as any)({}, { id: 'nonexistent-id', hotel: validUpdateInput }, mockContext, mockInfo)).rejects.toThrow(GraphQLError);
  });

  it('3. should throw error when update fails', async () => {
    mockHotelModel.findById.mockResolvedValue(existingHotel as any);
    mockHotelModel.findByIdAndUpdate.mockRejectedValue(new Error('Update failed'));

    await expect((updateHotel as any)({}, { id: '507f1f77bcf86cd799439011', hotel: validUpdateInput }, mockContext, mockInfo)).rejects.toThrow(GraphQLError);
  });

  it('4. should throw error when findByIdAndUpdate returns null', async () => {
    mockHotelModel.findById.mockResolvedValue(existingHotel as any);
    mockHotelModel.findByIdAndUpdate.mockResolvedValue(null);

    await expect((updateHotel as any)({}, { id: '507f1f77bcf86cd799439011', hotel: validUpdateInput }, mockContext, mockInfo)).rejects.toThrow(GraphQLError);
  });

  it('5. should re-throw GraphQLError when hotel not found', async () => {
    mockHotelModel.findById.mockResolvedValue(null);

    try {
      await (updateHotel as any)({}, { id: 'nonexistent-id', hotel: validUpdateInput }, mockContext, mockInfo);
      fail('Expected error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect((error as GraphQLError).extensions?.code).toBe('NOT_FOUND');
    }
  });
});
