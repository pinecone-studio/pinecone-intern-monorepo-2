import { GraphQLError } from 'graphql';
import { createHotel } from '../../../../src/resolvers/mutations/hotel/create-hotel';
import { HotelModel } from '../../../../src/models';
import { Amenity } from '../../../../src/generated';

// Mock the HotelModel
jest.mock('../../../../src/models', () => ({
  HotelModel: {
    create: jest.fn(),
  },
}));

const mockHotelModel = HotelModel as jest.Mocked<typeof HotelModel>;

describe('createHotel', () => {
  const mockContext = {};
  const mockInfo = {} as any;

  const validHotelInput = {
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
    amenities: [Amenity.Pool, Amenity.Wifi],
    policies: [],
    optionalExtras: [],
    faq: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('1. should create a hotel successfully', async () => {
    const mockCreatedHotel = {
      _id: '507f1f77bcf86cd799439011',
      ...validHotelInput,
      amenities: ['pool', 'wifi'],
    };

    mockHotelModel.create.mockResolvedValue(mockCreatedHotel as any);

    const result = await (createHotel as any)({}, { hotel: validHotelInput }, mockContext, mockInfo);

    expect(mockHotelModel.create).toHaveBeenCalledWith({
      ...validHotelInput,
      amenities: ['pool', 'wifi'],
    });

    expect(result).toEqual({
      success: true,
      message: 'Hotel created successfully',
    });
  });

  it('2. should throw error when hotel creation fails', async () => {
    mockHotelModel.create.mockRejectedValue(new Error('Database error'));

    await expect((createHotel as any)({}, { hotel: validHotelInput }, mockContext, mockInfo)).rejects.toThrow(GraphQLError);
  });

  it('3. should throw error when HotelModel.create returns null', async () => {
    mockHotelModel.create.mockResolvedValue(null as any);

    await expect((createHotel as any)({}, { hotel: validHotelInput }, mockContext, mockInfo)).rejects.toThrow(GraphQLError);
  });

  it('4. should throw error when HotelModel.create returns undefined', async () => {
    mockHotelModel.create.mockResolvedValue(undefined as any);

    await expect((createHotel as any)({}, { hotel: validHotelInput }, mockContext, mockInfo)).rejects.toThrow(GraphQLError);
  });
});
