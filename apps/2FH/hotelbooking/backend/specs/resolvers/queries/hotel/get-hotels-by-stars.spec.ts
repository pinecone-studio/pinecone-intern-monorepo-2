import { hotelsByStars } from '../../../../src/resolvers/queries/hotel/get-hotels-by-stars';
import { HotelModel } from '../../../../src/models';
import { mapAmenityToGraphQL } from '../../../../src/resolvers/common/amenities';

jest.mock('../../../../src/models', () => ({
  HotelModel: { find: jest.fn() },
}));

jest.mock('../../../../src/resolvers/common/amenities', () => ({
  mapAmenityToGraphQL: jest.fn(),
}));

const mockHotelModel = HotelModel as jest.Mocked<typeof HotelModel>;
const mockMapAmenityToGraphQL = mapAmenityToGraphQL as jest.MockedFunction<typeof mapAmenityToGraphQL>;

describe('hotelsByStars', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockMapAmenityToGraphQL.mockImplementation((amenity: string) => amenity.toUpperCase() as any);
  });

  const createMockChain = (resolveValue: any) => {
    const mockExec = jest.fn().mockResolvedValue(resolveValue);
    const mockLean = jest.fn().mockReturnValue({ exec: mockExec });
    const mockSort = jest.fn().mockReturnValue({ lean: mockLean });
    return { find: jest.fn().mockReturnValue({ sort: mockSort }), exec: mockExec };
  };

  it('should return hotels with proper transformation', async () => {
    const mockHotels = [
      {
        _id: { toString: () => '507f1f77bcf86cd799439011' },
        name: 'Hotel 1',
        stars: 5,
        amenities: ['wifi', 'pool'],
      },
    ];

    const { find } = createMockChain(mockHotels);
    mockHotelModel.find = find;

    const result = await (hotelsByStars as any)({} as any, { stars: 4 }, {} as any, {} as any);

    expect(find).toHaveBeenCalledWith({ stars: { $gte: 4 } });
    expect(result).toEqual([
      {
        name: 'Hotel 1',
        stars: 5,
        id: '507f1f77bcf86cd799439011',
        amenities: ['WIFI', 'POOL'],
      },
    ]);
    expect(mockMapAmenityToGraphQL).toHaveBeenCalledTimes(2);
  });

  it('should return empty array when no hotels found', async () => {
    const { find } = createMockChain([]);
    mockHotelModel.find = find;

    const result = await (hotelsByStars as any)({} as any, { stars: 5 }, {} as any, {} as any);

    expect(result).toEqual([]);
  });

  it('should handle undefined amenities with default empty array', async () => {
    const mockHotels = [
      {
        _id: { toString: () => '507f1f77bcf86cd799439012' },
        name: 'Hotel 2',
        stars: 3,
        // amenities is undefined
      },
    ];

    const { find } = createMockChain(mockHotels);
    mockHotelModel.find = find;

    const result = await (hotelsByStars as any)({} as any, { stars: 3 }, {} as any, {} as any);

    expect((result as any)[0].amenities).toEqual([]);
    expect(mockMapAmenityToGraphQL).not.toHaveBeenCalled();
  });

  it('should throw error when database query fails', async () => {
    mockHotelModel.find = jest.fn().mockImplementation(() => {
      throw new Error('Database error');
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Mock implementation to suppress console.error
    });

    await expect((hotelsByStars as any)({} as any, { stars: 4 }, {} as any, {} as any)).rejects.toThrow('Failed to fetch hotels by stars');

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should handle exec method failure', async () => {
    const mockExec = jest.fn().mockRejectedValue(new Error('Exec failed'));
    const mockLean = jest.fn().mockReturnValue({ exec: mockExec });
    const mockSort = jest.fn().mockReturnValue({ lean: mockLean });
    mockHotelModel.find = jest.fn().mockReturnValue({ sort: mockSort });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Mock implementation to suppress console.error
    });

    await expect((hotelsByStars as any)({} as any, { stars: 4 }, {} as any, {} as any)).rejects.toThrow('Failed to fetch hotels by stars');

    consoleSpy.mockRestore();
  });

  it('should properly transform _id to id', async () => {
    const mockObjectId = { toString: jest.fn().mockReturnValue('test-id') };
    const mockHotels = [
      {
        _id: mockObjectId,
        name: 'Test Hotel',
        stars: 4,
        amenities: [],
      },
    ];

    const { find } = createMockChain(mockHotels);
    mockHotelModel.find = find;

    const result = await (hotelsByStars as any)({} as any, { stars: 4 }, {} as any, {} as any);

    expect(mockObjectId.toString).toHaveBeenCalled();
    expect((result as any)[0].id).toBe('test-id');
    expect((result as any)[0]).not.toHaveProperty('_id');
  });
});
