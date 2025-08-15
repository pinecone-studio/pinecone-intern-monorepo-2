import { updateHotel } from '../../../../src/resolvers/mutations/hotel/update-hotel';
import { HotelModel } from '../../../../src/models';

jest.mock('../../../../src/models', () => ({
  HotelModel: {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

const mockHotelModel = HotelModel as jest.Mocked<typeof HotelModel>;

describe('updateHotel - Amenity Mapping', () => {
  const mockContext = {};
  const mockInfo = {} as any;

  const baseUpdateInput = {
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

  it('1. should update hotel with amenities mapping', async () => {
    const updateInputWithAmenities = {
      ...baseUpdateInput,
      amenities: ['POOL', 'GYM', 'RESTAURANT'],
    };

    mockHotelModel.findById.mockResolvedValue(existingHotel as any);
    mockHotelModel.findByIdAndUpdate.mockResolvedValue({
      ...existingHotel,
      ...updateInputWithAmenities,
      amenities: ['pool', 'gym', 'restaurant'],
    } as any);

    const result = await (updateHotel as any)({}, { id: '507f1f77bcf86cd799439011', hotel: updateInputWithAmenities }, mockContext, mockInfo);

    expect(mockHotelModel.findByIdAndUpdate).toHaveBeenCalledWith(
      '507f1f77bcf86cd799439011',
      {
        ...updateInputWithAmenities,
        amenities: ['pool', 'gym', 'restaurant'],
      },
      { new: true }
    );

    expect(result).toEqual({
      success: true,
      message: 'Hotel updated successfully',
    });
  });

  it('2. should handle unknown amenities with fallback', async () => {
    const updateInputWithUnknownAmenities = {
      ...baseUpdateInput,
      amenities: ['UNKNOWN_AMENITY', 'ANOTHER_UNKNOWN', 'WIFI'],
    };

    mockHotelModel.findById.mockResolvedValue(existingHotel as any);
    mockHotelModel.findByIdAndUpdate.mockResolvedValue({
      ...existingHotel,
      ...updateInputWithUnknownAmenities,
      amenities: ['UNKNOWN_AMENITY', 'ANOTHER_UNKNOWN', 'wifi'],
    } as any);

    const result = await (updateHotel as any)({}, { id: '507f1f77bcf86cd799439011', hotel: updateInputWithUnknownAmenities }, mockContext, mockInfo);

    expect(mockHotelModel.findByIdAndUpdate).toHaveBeenCalledWith(
      '507f1f77bcf86cd799439011',
      {
        ...updateInputWithUnknownAmenities,
        amenities: ['UNKNOWN_AMENITY', 'ANOTHER_UNKNOWN', 'wifi'],
      },
      { new: true }
    );

    expect(result).toEqual({
      success: true,
      message: 'Hotel updated successfully',
    });
  });

  it('3. should update hotel without amenities', async () => {
    mockHotelModel.findById.mockResolvedValue(existingHotel as any);
    mockHotelModel.findByIdAndUpdate.mockResolvedValue({
      ...existingHotel,
      ...baseUpdateInput,
    } as any);

    const result = await (updateHotel as any)({}, { id: '507f1f77bcf86cd799439011', hotel: baseUpdateInput }, mockContext, mockInfo);

    expect(mockHotelModel.findByIdAndUpdate).toHaveBeenCalledWith(
      '507f1f77bcf86cd799439011',
      baseUpdateInput,
      { new: true }
    );

    expect(result).toEqual({
      success: true,
      message: 'Hotel updated successfully',
    });
  });
}); 