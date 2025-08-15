import { hotel } from '../../../../src/resolvers/queries/hotel/get-hotel-by-id';
import { HotelModel } from '../../../../src/models';

jest.mock('../../../../src/models', () => ({
  HotelModel: {
    findById: jest.fn(),
  },
}));

const mockHotelModel = HotelModel as jest.Mocked<typeof HotelModel>;

describe('hotel amenity mapping', () => {
  const mockHotel = {
    _id: '507f1f77bcf86cd799439011',
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
    amenities: ['air_conditioning', 'wifi'],
    policies: [],
    optionalExtras: [],
    faq: [],
    toObject: jest.fn().mockReturnValue({
      _id: '507f1f77bcf86cd799439011',
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
      amenities: ['air_conditioning', 'wifi'],
      policies: [],
      optionalExtras: [],
      faq: [],
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('1. should handle unknown amenities with fallback to Wifi', async () => {
    const mockHotelWithUnknownAmenities = {
      ...mockHotel,
      toObject: jest.fn().mockReturnValue({
        ...mockHotel.toObject(),
        amenities: ['unknown_amenity', 'another_unknown', 'pool'],
      }),
    };
    mockHotelModel.findById.mockResolvedValue(mockHotelWithUnknownAmenities as any);

    const result = await (hotel as any)({}, { id: '507f1f77bcf86cd799439011' }, {}, {});

    expect(result.amenities).toEqual(['WIFI', 'WIFI', 'POOL']); // unknown amenities fallback to Wifi
  });

  it('2. should handle hotel with empty amenities array', async () => {
    const mockHotelWithNoAmenities = {
      ...mockHotel,
      toObject: jest.fn().mockReturnValue({
        ...mockHotel.toObject(),
        amenities: [],
      }),
    };
    mockHotelModel.findById.mockResolvedValue(mockHotelWithNoAmenities as any);

    const result = await (hotel as any)({}, { id: '507f1f77bcf86cd799439011' }, {}, {});

    expect(result.amenities).toEqual([]);
  });

  it('3. should handle all amenity mappings correctly', async () => {
    const mockHotelWithAllAmenities = {
      ...mockHotel,
      toObject: jest.fn().mockReturnValue({
        ...mockHotel.toObject(),
        amenities: [
          'pool',
          'gym',
          'restaurant',
          'bar',
          'wifi',
          'parking',
          'fitness_center',
          'business_center',
          'meeting_rooms',
          'conference_rooms',
          'room_service',
          'air_conditioning',
          'airport_transfer',
          'free_wifi',
          'free_parking',
          'free_cancellation',
          'spa',
          'pets_allowed',
          'smoking_allowed',
          'laundry_facilities',
        ],
      }),
    };
    mockHotelModel.findById.mockResolvedValue(mockHotelWithAllAmenities as any);

    const result = await (hotel as any)({}, { id: '507f1f77bcf86cd799439011' }, {}, {});

    expect(result.amenities).toEqual([
      'POOL',
      'GYM',
      'RESTAURANT',
      'BAR',
      'WIFI',
      'PARKING',
      'FITNESS_CENTER',
      'BUSINESS_CENTER',
      'MEETING_ROOMS',
      'CONFERENCE_ROOMS',
      'ROOM_SERVICE',
      'AIR_CONDITIONING',
      'AIRPORT_TRANSFER',
      'FREE_WIFI',
      'FREE_PARKING',
      'FREE_CANCELLATION',
      'SPA',
      'PETS_ALLOWED',
      'SMOKING_ALLOWED',
      'LAUNDRY_FACILITIES',
    ]);
  });
}); 