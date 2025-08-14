import { GraphQLError } from 'graphql';
import { hotel } from '../../../../src/resolvers/queries/hotel/get-hotel-by-id';
import { HotelModel } from '../../../../src/models';

jest.mock('../../../../src/models', () => ({
  HotelModel: {
    findById: jest.fn(),
  },
}));

const mockHotelModel = HotelModel as jest.Mocked<typeof HotelModel>;

describe('hotel', () => {
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

  it('should return hotel by id successfully', async () => {
    mockHotelModel.findById.mockResolvedValue(mockHotel as any);

    const result = await (hotel as any)({}, { id: '507f1f77bcf86cd799439011' }, {}, {});

    expect(mockHotelModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    expect(result.id).toBe('507f1f77bcf86cd799439011');
    expect(result.amenities).toEqual(['AIR_CONDITIONING', 'WIFI']);
  });

  it('should throw GraphQLError when hotel not found', async () => {
    mockHotelModel.findById.mockResolvedValue(null);

    try {
      await (hotel as any)({}, { id: 'nonexistent-id' }, {}, {});
      fail('Expected error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect((error as GraphQLError).message).toBe('Hotel not found');
      expect((error as GraphQLError).extensions?.code).toBe('NOT_FOUND');
    }
  });

  it('should throw GraphQLError when database query fails', async () => {
    mockHotelModel.findById.mockRejectedValue(new Error('Database error'));

    try {
      await (hotel as any)({}, { id: '507f1f77bcf86cd799439011' }, {}, {});
      fail('Expected error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect((error as GraphQLError).message).toBe('Failed to fetch hotel');
      expect((error as GraphQLError).extensions?.code).toBe('INTERNAL_SERVER_ERROR');
    }
  });
});
