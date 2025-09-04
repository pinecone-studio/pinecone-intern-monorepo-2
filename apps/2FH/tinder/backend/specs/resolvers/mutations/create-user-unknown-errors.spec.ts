import bcryptjs from 'bcryptjs';
import { GraphQLError } from 'graphql';
import {
  callCreateUser,
  createMockInput,
  createMockContext,
  // expectGraphQLError,
} from './helpers/create-user-test-helpers';

jest.mock('bcryptjs');
jest.mock('src/models', () => ({ User: { create: jest.fn() } }));
jest.mock('src/utils/mail-handler', () => ({ sendUserVerificationLink: jest.fn() }));

const mockHash = bcryptjs.hash as jest.Mock;

describe('createUser Mutation - Unknown Error Types', () => {
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

  it('should handle string errors', async () => {
    const mockInput = createMockInput();
    const mockContext = createMockContext();
    const stringError = 'String error';
    
    mockHash.mockRejectedValue(stringError);

    await expect(callCreateUser(mockInput, mockContext)).rejects.toThrow(
      new GraphQLError('Unknown error')
    );
    expect(consoleSpy).toHaveBeenCalledWith('Failed to create user:', stringError);
  });

  it('should handle null errors', async () => {
    const mockInput = createMockInput();
    const mockContext = createMockContext();
    
    mockHash.mockRejectedValue(null);

    await expect(callCreateUser(mockInput, mockContext)).rejects.toThrow(
      new GraphQLError('Unknown error')
    );
    expect(consoleSpy).toHaveBeenCalledWith('Failed to create user:', null);
  });

  it('should handle undefined errors', async () => {
    const mockInput = createMockInput();
    const mockContext = createMockContext();
    
    mockHash.mockRejectedValue(undefined);

    await expect(callCreateUser(mockInput, mockContext)).rejects.toThrow(
      new GraphQLError('Unknown error')
    );
    expect(consoleSpy).toHaveBeenCalledWith('Failed to create user:', undefined);
  });

  it('should handle object errors', async () => {
    const mockInput = createMockInput();
    const mockContext = createMockContext();
    const objectError = { message: 'Object error', code: 500 };
    
    mockHash.mockRejectedValue(objectError);

    await expect(callCreateUser(mockInput, mockContext)).rejects.toThrow(
      new GraphQLError('Unknown error')
    );
    expect(consoleSpy).toHaveBeenCalledWith('Failed to create user:', objectError);
  });

  it('should handle number errors', async () => {
    const mockInput = createMockInput();
    const mockContext = createMockContext();
    const numberError = 404;
    
    mockHash.mockRejectedValue(numberError);

    await expect(callCreateUser(mockInput, mockContext)).rejects.toThrow(
      new GraphQLError('Unknown error')
    );
    expect(consoleSpy).toHaveBeenCalledWith('Failed to create user:', numberError);
  });

  it('should handle boolean errors', async () => {
    const mockInput = createMockInput();
    const mockContext = createMockContext();
    const booleanError = false;
    
    mockHash.mockRejectedValue(booleanError);

    await expect(callCreateUser(mockInput, mockContext)).rejects.toThrow(
      new GraphQLError('Unknown error')
    );
    expect(consoleSpy).toHaveBeenCalledWith('Failed to create user:', booleanError);
  });
});