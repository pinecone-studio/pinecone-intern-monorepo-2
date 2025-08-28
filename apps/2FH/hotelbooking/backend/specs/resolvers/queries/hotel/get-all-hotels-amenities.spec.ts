import { hotels } from '../../../../src/resolvers/queries/hotel/get-all-hotels';
import { HotelModel } from '../../../../src/models';

jest.mock('../../../../src/models', () => ({
  HotelModel: {
    find: jest.fn(),
  },
}));

const mockHotelModel = HotelModel as jest.Mocked<typeof HotelModel>;

describe('hotels - Amenity Mapping', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('1. should map all amenities correctly', async () => {
    const hotelWithAllAmenities = [
      {
        _id: '507f1f77bcf86cd799439013',
        name: 'All Amenities Hotel',
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
        toObject: jest.fn().mockReturnValue({
          _id: '507f1f77bcf86cd799439013',
          name: 'All Amenities Hotel',
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
      },
    ];

    mockHotelModel.find.mockResolvedValue(hotelWithAllAmenities as any);

    const result = await (hotels as any)({}, {}, {}, {});

    expect(result[0].amenities).toEqual([
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

  it('2. should handle unknown amenities with fallback to Wifi', async () => {
    const hotelWithUnknownAmenities = [
      {
        _id: '507f1f77bcf86cd799439014',
        name: 'Unknown Amenities Hotel',
        amenities: ['unknown_amenity', 'another_unknown', 'pool'],
        toObject: jest.fn().mockReturnValue({
          _id: '507f1f77bcf86cd799439014',
          name: 'Unknown Amenities Hotel',
          amenities: ['unknown_amenity', 'another_unknown', 'pool'],
        }),
      },
    ];

    mockHotelModel.find.mockResolvedValue(hotelWithUnknownAmenities as any);

    const result = await (hotels as any)({}, {}, {}, {});

    expect(result[0].amenities).toEqual(['WIFI', 'WIFI', 'POOL']); // unknown amenities fallback to Wifi
  });

  it('3. should handle hotel with empty amenities array', async () => {
    const hotelWithNoAmenities = [
      {
        _id: '507f1f77bcf86cd799439015',
        name: 'No Amenities Hotel',
        amenities: [],
        toObject: jest.fn().mockReturnValue({
          _id: '507f1f77bcf86cd799439015',
          name: 'No Amenities Hotel',
          amenities: [],
        }),
      },
    ];

    mockHotelModel.find.mockResolvedValue(hotelWithNoAmenities as any);

    const result = await (hotels as any)({}, {}, {}, {});

    expect(result[0].amenities).toEqual([]);
  });
});
