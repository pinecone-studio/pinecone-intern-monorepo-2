import { createHotel } from '../../../../src/resolvers/mutations/hotel/create-hotel';
import { HotelModel } from '../../../../src/models';

jest.mock('../../../../src/models', () => ({
  HotelModel: {
    create: jest.fn(),
  },
}));

const mockHotelModel = HotelModel as jest.Mocked<typeof HotelModel>;

describe('createHotel - Amenity Mapping', () => {
  const mockContext = {};
  const mockInfo = {} as any;

  const baseHotelInput = {
    name: 'Test Hotel',
    description: 'A test hotel',
    images: ['https://example.com/image.jpg'],
    stars: 4,
    phone: '1234567890',
    rating: 8.5,
    city: 'Test City',
    country: 'Test Country',
    location: 'Test Location',
    languages: ['English'],
    policies: [],
    optionalExtras: [],
    faq: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle basic amenity mappings correctly', async () => {
    const hotelWithAmenities = {
      ...baseHotelInput,
      amenities: ['POOL', 'GYM', 'RESTAURANT'],
    };

    const mockCreatedHotel = {
      _id: '507f1f77bcf86cd799439011',
      ...hotelWithAmenities,
      amenities: ['pool', 'gym', 'restaurant'],
    };

    mockHotelModel.create.mockResolvedValue(mockCreatedHotel as any);

    const result = await (createHotel as any)({}, { hotel: hotelWithAmenities }, mockContext, mockInfo);

    expect(mockHotelModel.create).toHaveBeenCalledWith({
      ...hotelWithAmenities,
      amenities: ['pool', 'gym', 'restaurant'],
    });

    expect(result).toEqual({
      success: true,
      message: 'Hotel created successfully',
    });
  });

  it('should handle unknown amenities with fallback', async () => {
    const hotelWithUnknownAmenities = {
      ...baseHotelInput,
      amenities: ['UNKNOWN_AMENITY', 'ANOTHER_UNKNOWN', 'WIFI'],
    };

    const mockCreatedHotel = {
      _id: '507f1f77bcf86cd799439011',
      ...hotelWithUnknownAmenities,
      amenities: ['UNKNOWN_AMENITY', 'ANOTHER_UNKNOWN', 'wifi'],
    };

    mockHotelModel.create.mockResolvedValue(mockCreatedHotel as any);

    const result = await (createHotel as any)({}, { hotel: hotelWithUnknownAmenities }, mockContext, mockInfo);

    expect(mockHotelModel.create).toHaveBeenCalledWith({
      ...hotelWithUnknownAmenities,
      amenities: ['UNKNOWN_AMENITY', 'ANOTHER_UNKNOWN', 'wifi'],
    });

    expect(result).toEqual({
      success: true,
      message: 'Hotel created successfully',
    });
  });

  it('should handle hotel with empty amenities array', async () => {
    const hotelWithNoAmenities = {
      ...baseHotelInput,
      amenities: [],
    };

    const mockCreatedHotel = {
      _id: '507f1f77bcf86cd799439011',
      ...hotelWithNoAmenities,
      amenities: [],
    };

    mockHotelModel.create.mockResolvedValue(mockCreatedHotel as any);

    const result = await (createHotel as any)({}, { hotel: hotelWithNoAmenities }, mockContext, mockInfo);

    expect(mockHotelModel.create).toHaveBeenCalledWith({
      ...hotelWithNoAmenities,
      amenities: [],
    });

    expect(result).toEqual({
      success: true,
      message: 'Hotel created successfully',
    });
  });
}); 