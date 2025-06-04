import { Food } from 'src/models/food-model';
import { updateFood } from 'src/resolvers/mutations';

jest.mock('src/models/food-model', () => ({
  Food: {
    findByIdAndUpdate: jest.fn(),
  },
}));

const mockFood = Food as jest.Mocked<typeof Food>;

describe('updateFood mutation unit tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update the food successfully', async () => {
    const mockId = '507f1f77bcf86cd799439011';
    const mockInput = {
      _id: mockId,
      name: 'Pizza',
      price: 12.99,
      description: 'Delicious cheese pizza',
      image: 'pizza.jpg',
    };

    const mockUpdatedFood = {
      _id: mockId,
      name: 'Pizza',
      price: 12.99,
      description: 'Delicious cheese pizza',
      image: 'pizza.jpg',
    };

    mockFood.findByIdAndUpdate.mockResolvedValue(mockUpdatedFood);

    const result = await updateFood(null, { input: mockInput });

    expect(mockFood.findByIdAndUpdate).toHaveBeenCalledWith(
      mockId,
      {
        name: 'Pizza',
        price: 12.99,
        description: 'Delicious cheese pizza',
        image: 'pizza.jpg',
      },
      { new: true }
    );
    expect(result).toEqual(mockUpdatedFood);
  });

  it('should update the food with partial data', async () => {
    const mockId = '507f1f77bcf86cd799439011';
    const mockInput = {
      _id: mockId,
      name: 'Updated Pizza',
      price: 15.99,
    };

    const mockUpdatedFood = {
      _id: mockId,
      name: 'Updated Pizza',
      price: 15.99,
      description: 'Original description',
      image: 'original.jpg',
    };

    mockFood.findByIdAndUpdate.mockResolvedValue(mockUpdatedFood);

    const result = await updateFood(null, { input: mockInput });

    expect(mockFood.findByIdAndUpdate).toHaveBeenCalledWith(
      mockId,
      {
        name: 'Updated Pizza',
        price: 15.99,
      },
      { new: true }
    );
    expect(result).toEqual(mockUpdatedFood);
  });

  it('should throw error when food item is not found', async () => {
    const mockId = '507f1f77bcf86cd799439011';
    const mockInput = {
      _id: mockId,
      name: 'Pizza',
    };

    mockFood.findByIdAndUpdate.mockResolvedValue(null);

    await expect(updateFood(null, { input: mockInput })).rejects.toThrow('Error updating food item: Food item not found');

    expect(mockFood.findByIdAndUpdate).toHaveBeenCalledWith(mockId, { name: 'Pizza' }, { new: true });
  });

  it('should throw error when database operation fails', async () => {
    const mockId = '507f1f77bcf86cd799439011';
    const mockInput = {
      _id: mockId,
      name: 'Pizza',
    };

    const dbError = new Error('Database connection failed');
    mockFood.findByIdAndUpdate.mockRejectedValue(dbError);

    await expect(updateFood(null, { input: mockInput })).rejects.toThrow('Error updating food item: Database connection failed');

    expect(mockFood.findByIdAndUpdate).toHaveBeenCalledWith(mockId, { name: 'Pizza' }, { new: true });
  });

  it('should handle invalid ObjectId', async () => {
    const invalidId = 'invalid-id';
    const mockInput = {
      _id: invalidId,
      name: 'Pizza',
    };

    const mongoError = new Error('Cast to ObjectId failed');
    mockFood.findByIdAndUpdate.mockRejectedValue(mongoError);

    await expect(updateFood(null, { input: mockInput })).rejects.toThrow('Error updating food item: Cast to ObjectId failed');
  });
  it('should exist and be a function', () => {
    expect(typeof updateFood).toBe('function');
  });
});
