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

  it('1. should return hotel by id successfully', async () => {
    mockHotelModel.findById.mockResolvedValue(mockHotel as any);

    const result = await (hotel as any)({}, { id: '507f1f77bcf86cd799439011' }, {}, {});

    expect(mockHotelModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    expect(result.id).toBe('507f1f77bcf86cd799439011');
    expect(result.amenities).toEqual(['AIR_CONDITIONING', 'WIFI']);
    expect(result._id).toBeUndefined();
  });

  it('2. should throw GraphQLError when hotel not found', async () => {
    mockHotelModel.findById.mockResolvedValue(null);

    try {
      await (hotel as any)({}, { id: 'nonexistent-id' }, {}, {});
      fail('Expected error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect((error as GraphQLError).message).toBe('Hotel not found');
      expect((error as GraphQLError).extensions?.code).toBe('NOT_FOUND');
      expect((error as GraphQLError).extensions?.http).toEqual({ status: 404 });
    }
  });

  it('3. should throw GraphQLError when database query fails', async () => {
    mockHotelModel.findById.mockRejectedValue(new Error('Database error'));

    try {
      await (hotel as any)({}, { id: '507f1f77bcf86cd799439011' }, {}, {});
      fail('Expected error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(GraphQLError);
      expect((error as GraphQLError).message).toBe('Failed to fetch hotel');
      expect((error as GraphQLError).extensions?.code).toBe('INTERNAL_SERVER_ERROR');
      expect((error as GraphQLError).extensions?.http).toEqual({ status: 500 });
    }
  });

  it('4. should re-throw GraphQLError when it is already a GraphQLError', async () => {
    const graphQLError = new GraphQLError('Custom GraphQL Error');
    const mockHotelWithError = {
      ...mockHotel,
      toObject: jest.fn().mockImplementation(() => {
        throw graphQLError;
      }),
    };
    mockHotelModel.findById.mockResolvedValue(mockHotelWithError as any);

    try {
      await (hotel as any)({}, { id: '507f1f77bcf86cd799439011' }, {}, {});
      fail('Expected error to be thrown');
    } catch (error) {
      expect(error).toBe(graphQLError);
      expect((error as GraphQLError).message).toBe('Custom GraphQL Error');
    }
  });
});
