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

describe('createUser Mutation - Success Cases', () => {
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

  it('should create a user successfully and send verification link', async () => {
    const mockInput = createMockInput();
    const mockContext = createMockContext();
    
    mockHash.mockResolvedValue('hashed_password');
    mockCreate.mockResolvedValue({ _id: 'user_id', email: mockInput.email });
    mockSendLink.mockResolvedValue({});

    const result = await callCreateUser(mockInput, mockContext);

    expect(consoleSpy).toHaveBeenCalledWith('Creating user with input:', JSON.stringify(mockInput));
    expect(mockHash).toHaveBeenCalledWith(mockInput.password, 10);
    expect(mockCreate).toHaveBeenCalledWith({
      email: mockInput.email,
      password: 'hashed_password',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
    expect(consoleSpy).toHaveBeenCalledWith('User created successfully:', mockInput.email);
    expect(mockSendLink).toHaveBeenCalledWith('https://example.com', mockInput.email);
    expect(result).toBe('SUCCESS');
  });

  it('should handle different protocol and host combinations', async () => {
    const mockInput = createMockInput();
    const mockContext = createMockContext({
      req: {
        nextUrl: { protocol: 'http:', host: 'localhost:3000' },
      },
    });
    
    mockHash.mockResolvedValue('hashed_password');
    mockCreate.mockResolvedValue({});
    mockSendLink.mockResolvedValue({});

    await callCreateUser(mockInput, mockContext);

    expect(mockSendLink).toHaveBeenCalledWith('http://localhost:3000', mockInput.email);
  });
});