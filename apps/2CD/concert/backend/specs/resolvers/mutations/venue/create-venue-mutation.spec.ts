/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GraphQLResolveInfo } from 'graphql';
import { venueModel } from 'src/models';
import { createVenue } from 'src/resolvers/mutations';

const mockInput = {
  name: 'test',
  address: 'test address',
  city: 'city',
  capacity: 100,
};

jest.mock('src/models', () => ({
  venueModel: {
    create: jest.fn(),
  },
}));
describe('createVenue', () => {
  const mockInfo = {} as GraphQLResolveInfo;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if input fields are missing', async () => {
    const badInput = { ...mockInput, name: '' };

    await expect(createVenue!({}, { input: badInput }, {}, mockInfo)).rejects.toThrow('missing required input fields');
  });

  it('should create a venue successfully', async () => {
    const mockVenue = { _id: 'venue123', ...mockInput };
    (venueModel.create as jest.Mock).mockResolvedValueOnce(mockVenue);

    const result = await createVenue!({}, { input: mockInput }, {}, mockInfo);

    expect(venueModel.create).toHaveBeenCalledWith({
      address: mockInput.address,
      city: mockInput.city,
      name: mockInput.name,
      capacity: mockInput.capacity,
    });

    expect(result).toEqual(mockVenue);
  });
});
