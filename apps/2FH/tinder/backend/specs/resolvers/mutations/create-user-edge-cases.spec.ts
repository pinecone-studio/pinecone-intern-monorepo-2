import { User } from 'src/models';
import bcryptjs from 'bcryptjs';
import { sendUserVerificationLink } from 'src/utils/mail-handler';
import {
  callCreateUser,
  createMockInput,
  createMockContext,
} from './helpers/create-user-test-helpers';

jest.mock('bcryptjs');
jest.mock('src/models', () => ({ User: { create: jest.fn() } }));
jest.mock('src/utils/mail-handler', () => ({ sendUserVerificationLink: jest.fn() }));

const mockHash = bcryptjs.hash as jest.Mock;
const mockCreate = User.create as jest.Mock;
const mockSendLink = sendUserVerificationLink as jest.Mock;

describe('createUser Mutation - Edge Cases', () => {
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

  it('should handle empty email', async () => {
    const mockInput = createMockInput({ email: '' });
    const mockContext = createMockContext();
    
    mockHash.mockResolvedValue('hashed_password');
    mockCreate.mockResolvedValue({});
    mockSendLink.mockResolvedValue({});

    const result = await callCreateUser(mockInput, mockContext);

    expect(result).toBe('SUCCESS');
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        email: '',
        password: 'hashed_password',
      })
    );
  });

  it('should handle empty password', async () => {
    const mockInput = createMockInput({ password: '' });
    const mockContext = createMockContext();
    
    mockHash.mockResolvedValue('hashed_password');
    mockCreate.mockResolvedValue({});
    mockSendLink.mockResolvedValue({});

    const result = await callCreateUser(mockInput, mockContext);

    expect(result).toBe('SUCCESS');
    expect(mockHash).toHaveBeenCalledWith('', 10);
  });

  it('should handle special characters in email', async () => {
    const mockInput = createMockInput({ email: 'test+tag@example.co.uk' });
    const mockContext = createMockContext();
    
    mockHash.mockResolvedValue('hashed_password');
    mockCreate.mockResolvedValue({});
    mockSendLink.mockResolvedValue({});

    const result = await callCreateUser(mockInput, mockContext);

    expect(result).toBe('SUCCESS');
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'test+tag@example.co.uk',
      })
    );
  });

  it('should handle very long password', async () => {
    const longPassword = 'a'.repeat(1000);
    const mockInput = createMockInput({ password: longPassword });
    const mockContext = createMockContext();
    
    mockHash.mockResolvedValue('hashed_password');
    mockCreate.mockResolvedValue({});
    mockSendLink.mockResolvedValue({});

    const result = await callCreateUser(mockInput, mockContext);

    expect(result).toBe('SUCCESS');
    expect(mockHash).toHaveBeenCalledWith(longPassword, 10);
  });
});