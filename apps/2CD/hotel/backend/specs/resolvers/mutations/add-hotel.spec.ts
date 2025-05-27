import { Hotel } from '../../../src/models/hotel';
import { addHotel } from '../../../src/resolvers/mutations/add-hotel';
import { IHotel } from '../../../src/models/hotel';

jest.mock('../../../src/models/hotel', () => ({
  Hotel: jest.fn().mockImplementation((data: Partial<IHotel>) => ({
    save: jest.fn().mockResolvedValue(data),
    ...data,
  })),
}));

describe('addHotel mutation', () => {
  const mockInput = {
    hotelName: 'Test Hotel',
    price: 100,
    description: 'A test hotel',
    phoneNumber: '123-456-7890',
    amenities: ['WiFi', 'Pool'],
    hotelStar: 4,
    rooms: [],
    guestReviews: [],
    bookings: [],
    roomServices: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully create a new hotel', async () => {
    const mockSavedHotel = {
      ...mockInput,
      _id: 'mock-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    ((Hotel as unknown) as jest.Mock).mockImplementationOnce((data: Partial<IHotel>) => ({
      ...data,
      ...mockSavedHotel,
      save: jest.fn().mockResolvedValue(mockSavedHotel),
    }));

    const result = await addHotel(null, { input: mockInput });
    expect(Hotel).toHaveBeenCalledWith(expect.objectContaining(mockInput));
    expect(result).toEqual(mockSavedHotel);
  });

  it('should throw an error if hotel creation fails with Error instance', async () => {
    const errorMessage = 'Database error';
    
    ((Hotel as unknown) as jest.Mock).mockImplementationOnce((data: Partial<IHotel>) => ({
      ...data,
      save: jest.fn().mockRejectedValue(new Error(errorMessage)),
    }));

    await expect(addHotel(null, { input: mockInput }))
      .rejects
      .toThrow(`Failed to add hotel: ${errorMessage}`);
  });

  it('should throw an error if hotel creation fails with non-Error', async () => {
    ((Hotel as unknown) as jest.Mock).mockImplementationOnce((data: Partial<IHotel>) => ({
      ...data,
      save: jest.fn().mockRejectedValue('Unknown error occurred'),
    }));

    await expect(addHotel(null, { input: mockInput }))
      .rejects
      .toThrow('Failed to add hotel: Unknown error');
  });

  it('should handle missing optional fields', async () => {
    const minimalInput = {
      hotelName: 'Test Hotel',
      price: 100,
      description: 'A test hotel',
      phoneNumber: '123-456-7890',
    };

    const mockSavedHotel = {
      ...minimalInput,
      amenities: [],
      rooms: [],
      guestReviews: [],
      bookings: [],
      roomServices: [],
      _id: 'mock-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    ((Hotel as unknown) as jest.Mock).mockImplementationOnce((data: Partial<IHotel>) => ({
      ...data,
      ...mockSavedHotel,
      save: jest.fn().mockResolvedValue(mockSavedHotel),
    }));

    const result = await addHotel(null, { input: minimalInput });
    expect(Hotel).toHaveBeenCalledWith(expect.objectContaining(minimalInput));
    expect(result).toEqual(mockSavedHotel);
  });
});