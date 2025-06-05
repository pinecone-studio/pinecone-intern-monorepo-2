import { Hotel } from '../../../../src/models/hotel';
import { getHotelById } from '../../../../src/resolvers/queries/hotel/get-hotel-by-id';

jest.mock('../../../../src/models/hotel', () => ({
  Hotel: {
    findById: jest.fn(),
  },
}));

describe('getHotelById query', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return hotel by id successfully', async () => {
    const mockHotel = {
      _id: 'id-1',
      hotelName: 'Test Hotel',
      price: 100,
      description: 'description1',
      phoneNumber: '12345678',
      amenities: ['wifi'],
      hotelStar: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const execMock = jest.fn().mockResolvedValue(mockHotel);
    (Hotel.findById as jest.Mock).mockReturnValue({ exec: execMock });

    const result = await getHotelById(null, { id: 'id-1' });

    expect(Hotel.findById).toHaveBeenCalledWith('id-1');
    expect(execMock).toHaveBeenCalled();
    expect(result).toEqual(mockHotel);
  });

  it('should throw an error if hotel is not found', async () => {
    const execMock = jest.fn().mockResolvedValue(null);
    (Hotel.findById as jest.Mock).mockReturnValue({ exec: execMock });

    await expect(getHotelById(null, { id: 'non-existent-id' }))
      .rejects
      .toThrow('Failed to fetch hotel: Hotel with id non-existent-id not found');
  });

  it('should throw an error if fetching hotel fails with Error instance', async () => {
    const errorMessage = 'Database error';
    
    const execMock = jest.fn().mockRejectedValue(new Error(errorMessage));
    (Hotel.findById as jest.Mock).mockReturnValue({ exec: execMock });

    await expect(getHotelById(null, { id: 'id-1' }))
      .rejects
      .toThrow(`Failed to fetch hotel: ${errorMessage}`);
  });

  it('should throw an error if fetching hotel fails with non-Error', async () => {
    const execMock = jest.fn().mockRejectedValue('Unknown error occurred');
    (Hotel.findById as jest.Mock).mockReturnValue({ exec: execMock });

    await expect(getHotelById(null, { id: 'id-1' }))
      .rejects
      .toThrow('Failed to fetch hotel: Unknown error');
  });
});
