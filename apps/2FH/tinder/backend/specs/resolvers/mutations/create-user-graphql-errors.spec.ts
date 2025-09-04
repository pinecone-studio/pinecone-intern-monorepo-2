import { User } from 'src/models';
import bcryptjs from 'bcryptjs';
import { sendUserVerificationLink } from 'src/utils/mail-handler';
// import { GraphQLError } from 'graphql';
import {
  callCreateUser,
  createMockInput,
  createMockContext,
  createGraphQLError,
} from './helpers/create-user-test-helpers';

jest.mock('bcryptjs');
jest.mock('src/models', () => ({ User: { create: jest.fn() } }));
jest.mock('src/utils/mail-handler', () => ({ sendUserVerificationLink: jest.fn() }));

const mockHash = bcryptjs.hash as jest.Mock;
const mockCreate = User.create as jest.Mock;
const mockSendLink = sendUserVerificationLink as jest.Mock;

describe('createUser Mutation - GraphQL Error Handling', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {
      // Mock implementation - intentionally empty
    });
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should re-throw GraphQLError from bcryptjs.hash', async () => {
    const mockInput = createMockInput();
    const mockContext = createMockContext();
    const graphqlError = createGraphQLError('GraphQL error from bcrypt');
    
    mockHash.mockRejectedValue(graphqlError);

    await expect(callCreateUser(mockInput, mockContext)).rejects.toThrow(graphqlError);
    expect(consoleSpy).toHaveBeenCalledWith('Failed to create user:', graphqlError);
  });

  it('should re-throw GraphQLError from User.create', async () => {
    const mockInput = createMockInput();
    const mockContext = createMockContext();
    const graphqlError = createGraphQLError('GraphQL error from User.create');
    
    mockHash.mockResolvedValue('hashed_password');
    mockCreate.mockRejectedValue(graphqlError);

    await expect(callCreateUser(mockInput, mockContext)).rejects.toThrow(graphqlError);
    expect(consoleSpy).toHaveBeenCalledWith('Failed to create user:', graphqlError);
  });

  it('should re-throw GraphQLError from sendUserVerificationLink', async () => {
    const mockInput = createMockInput();
    const mockContext = createMockContext();
    const graphqlError = createGraphQLError('GraphQL error from sendUserVerificationLink');
    
    mockHash.mockResolvedValue('hashed_password');
    mockCreate.mockResolvedValue({});
    mockSendLink.mockRejectedValue(graphqlError);

    await expect(callCreateUser(mockInput, mockContext)).rejects.toThrow(graphqlError);
    expect(consoleSpy).toHaveBeenCalledWith('Failed to create user:', graphqlError);
  });
});