import { User } from 'src/models';
import bcryptjs from 'bcryptjs';
import { sendUserVerificationLink } from 'src/utils/mail-handler';
import { GraphQLError } from 'graphql';
import {
  callCreateUser,
  createMockInput,
  createMockContext,
  createRegularError,
  // expectGraphQLError,
} from './helpers/create-user-test-helpers';

jest.mock('bcryptjs');
jest.mock('src/models', () => ({ User: { create: jest.fn() } }));
jest.mock('src/utils/mail-handler', () => ({ sendUserVerificationLink: jest.fn() }));

const mockHash = bcryptjs.hash as jest.Mock;
const mockCreate = User.create as jest.Mock;
const mockSendLink = sendUserVerificationLink as jest.Mock;

describe('createUser Mutation - Regular Error Handling', () => {
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

  it('should wrap regular Error from bcryptjs.hash into GraphQLError', async () => {
    const mockInput = createMockInput();
    const mockContext = createMockContext();
    const regularError = createRegularError('Bcrypt error');
    
    mockHash.mockRejectedValue(regularError);

    await expect(callCreateUser(mockInput, mockContext)).rejects.toThrow(
      new GraphQLError('Bcrypt error')
    );
    expect(consoleSpy).toHaveBeenCalledWith('Failed to create user:', regularError);
  });

  it('should wrap regular Error from User.create into GraphQLError', async () => {
    const mockInput = createMockInput();
    const mockContext = createMockContext();
    const regularError = createRegularError('User creation failed');
    
    mockHash.mockResolvedValue('hashed_password');
    mockCreate.mockRejectedValue(regularError);

    await expect(callCreateUser(mockInput, mockContext)).rejects.toThrow(
      new GraphQLError('User creation failed')
    );
    expect(consoleSpy).toHaveBeenCalledWith('Failed to create user:', regularError);
  });

  it('should wrap regular Error from sendUserVerificationLink into GraphQLError', async () => {
    const mockInput = createMockInput();
    const mockContext = createMockContext();
    const regularError = createRegularError('Email sending failed');
    
    mockHash.mockResolvedValue('hashed_password');
    mockCreate.mockResolvedValue({});
    mockSendLink.mockRejectedValue(regularError);

    await expect(callCreateUser(mockInput, mockContext)).rejects.toThrow(
      new GraphQLError('Email sending failed')
    );
    expect(consoleSpy).toHaveBeenCalledWith('Failed to create user:', regularError);
  });
});