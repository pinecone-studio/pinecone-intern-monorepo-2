import { signUp } from '../../../../src/resolvers/mutations/auth/sign-up-mutation';
import User from '../../../../src/models/user.model';
import { GraphQLResolveInfo } from 'graphql';

// Mock Mongoose methods
jest.mock('../../../../src/models/user.model', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

describe('signUp Mutation', () => {
  it('should throw an error if the user already exists', async () => {
    // Mock findOne to simulate that a user already exists
    (User.findOne as jest.Mock).mockResolvedValueOnce({ email: 'test@email.com' });

    try {
      // Call the signUp mutation with an email that already exists
      await signUp!({}, { email: 'test@email.com', password: 'test1234' }, { userId: null }, {} as GraphQLResolveInfo);
    } catch (error) {
      // Expect the error message to be "User already exists"
      expect(error).toEqual(new Error('User already exists'));
    }
  });

  it('should create a user when the email is not already taken', async () => {
    // Mock findOne to simulate that no user exists with the given email
    (User.findOne as jest.Mock).mockResolvedValueOnce(null);

    // Mock create to simulate user creation
    (User.create as jest.Mock).mockResolvedValueOnce({
      email: 'test@email.com',
      password: 'test1234',
      _id: '1',
    });

    // Call the signUp mutation with a new email
    const result = await signUp!({}, { email: 'test@email.com', password: 'test1234' }, { userId: null }, {} as GraphQLResolveInfo);

    // Assert that the returned result matches the mock data
    expect(result).toEqual({
      email: 'test@email.com',
      password: 'test1234',
      _id: '1',
    });
  });
});
