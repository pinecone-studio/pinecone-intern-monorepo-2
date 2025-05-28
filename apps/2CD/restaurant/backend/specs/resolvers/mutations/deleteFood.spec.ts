import { deleteFood } from 'src/resolvers/mutations/foodRelatedMutations/delete-food';
import { Food } from 'src/models/food-model';
describe('delete food mutation unit tests', () => {
  it('should be defined', () => {
    expect(deleteFood).toBeDefined();
  });

  it('should delete a food item by id', async () => {
    const mockId = '12345';
    const mockDeletedFood = { id: mockId, name: 'Pizza', price: 10 };

    jest.spyOn(Food, 'findByIdAndDelete').mockResolvedValue(mockDeletedFood as any);

    const result = await deleteFood({}, { id: mockId });
    expect(result).toEqual(mockDeletedFood);
  });

  it('should throw an error if food item not found', async () => {
    const mockId = '12345';

    jest.spyOn(Food, 'findByIdAndDelete').mockResolvedValue(null);

    await expect(deleteFood({}, { id: mockId })).rejects.toThrow('Food item not found');
  }
  );
  it('should throw an error if there is a database error', async () => {
    const mockId = '12345';
    const mockError = new Error('Database error');  
    jest.spyOn(Food, 'findByIdAndDelete').mockRejectedValue(mockError);
    await expect(deleteFood({}, { id: mockId })).rejects.toThrow('Error deleting food item: Database error');
  });
});
