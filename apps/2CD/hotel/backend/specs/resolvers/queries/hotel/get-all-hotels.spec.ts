import { Hotel } from '../../../../src/models/hotel';
import { getAllHotels } from '../../../../src/resolvers/queries/hotel/get-all-hotels';

jest.mock('../../../../src/models/hotel', () => ({
  Hotel: {
    find: jest.fn(),
  },
}));

describe('getAllHotels query', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all hotels successfully', async () => {
    const mockHotels = [
      {
        _id: 'id-1',
        hotelName: 'Test Hotel',
        price: 100,
        description: 'deskription1',
        phoneNumber: '12345678',
        amenities: ['wifi'],
        hotelStar: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'id-2',
        hotelName: 'Test Hotel 2',
        price: 200,
        description: 'description2',
        phoneNumber: '098-765-4321',
        amenities: ['Pool'],
        hotelStar: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const execMock = jest.fn().mockResolvedValue(mockHotels);
    const findMock = jest.fn().mockReturnValue({ exec: execMock });
    (Hotel.find as jest.Mock).mockImplementation(findMock);

    const result = await getAllHotels();

    expect(Hotel.find).toHaveBeenCalled();
    expect(execMock).toHaveBeenCalled();
    expect(result).toEqual(mockHotels);
  });

  it('should throw an error if fetching hotels fails with Error instance', async () => {
    const errorMessage = 'Database error';
    
    const execMock = jest.fn().mockRejectedValue(new Error(errorMessage));
    const findMock = jest.fn().mockReturnValue({ exec: execMock });
    (Hotel.find as jest.Mock).mockImplementation(findMock);

    await expect(getAllHotels())
      .rejects
      .toThrow(`Failed to fetch hotels: ${errorMessage}`);
  });

  it('should throw an error if fetching hotels fails with non-Error', async () => {
    const execMock = jest.fn().mockRejectedValue('Unknown error occurred');
    const findMock = jest.fn().mockReturnValue({ exec: execMock });
    (Hotel.find as jest.Mock).mockImplementation(findMock);

    await expect(getAllHotels())
      .rejects
      .toThrow('Failed to fetch hotels: Unknown error');
  });

  it('should return empty array when no hotels exist', async () => {
    const execMock = jest.fn().mockResolvedValue([]);
    const findMock = jest.fn().mockReturnValue({ exec: execMock });
    (Hotel.find as jest.Mock).mockImplementation(findMock);

    const result = await getAllHotels();

    expect(Hotel.find).toHaveBeenCalled();
    expect(execMock).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
