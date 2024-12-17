import { GraphQLResolveInfo } from 'graphql';
import { userModel } from 'src/models';
import { searchUsers } from 'src/resolvers/queries';

jest.mock('../../../../src/models/user.model.ts');

describe('searchUsers Resolver', () => {
  const mockUserId = 'mockId';
  const mockUsers = [
    { userName: 'john_doe', fullName: 'John Doe' },
    { userName: 'jane_doe', fullName: 'Jane Doe' },
    { userName: 'jack', fullName: 'Jack Smith' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if searchTerm is not provided', async () => {
    await expect(searchUsers!({}, {} as any, { userId: mockUserId }, {} as GraphQLResolveInfo)).rejects.toThrow('Search term is required.');
  });

  it('should throw an error if user is unauthorized', async () => {
    await expect(searchUsers!({}, {} as any, { userId: null }, {} as GraphQLResolveInfo)).rejects.toThrow('Unauthorized');
  });

  it('should return users matching the searchTerm in userName or fullName', async () => {
    (userModel.find as jest.Mock).mockResolvedValue(mockUsers);

    const args = { searchTerm: 'doe' };
    const result = await searchUsers!({}, args, { userId: mockUserId }, {} as GraphQLResolveInfo);

    expect(userModel.find).toHaveBeenCalledWith({
      $or: [{ userName: { $regex: 'doe', $options: 'i' } }, { fullName: { $regex: 'doe', $options: 'i' } }],
    });
    expect(result).toEqual([
      { userName: 'john_doe', fullName: 'John Doe' },
      { userName: 'jane_doe', fullName: 'Jane Doe' },
      { userName: 'jack', fullName: 'Jack Smith' },
    ]);
  });

  it('should return an empty array if no users match the searchTerm', async () => {
    (userModel.find as jest.Mock).mockResolvedValue([]);

    const args = { searchTerm: 'nonexistent' };
    const result = await searchUsers!({}, args, { userId: mockUserId }, {} as GraphQLResolveInfo);

    expect(userModel.find).toHaveBeenCalledWith({
      $or: [{ userName: { $regex: 'nonexistent', $options: 'i' } }, { fullName: { $regex: 'nonexistent', $options: 'i' } }],
    });
    expect(result).toEqual([]);
  });
});
