import { WebhookEvent } from '@clerk/nextjs/server';
import POST from '../../src/pages/api/webhooks/clerk';
import User from '../../src/models/user';

// Webhook test
jest.mock('../../src/models/user', () => ({
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
}));

describe('Clerk Webhook Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle user creation', async () => {
    const mockUserData = {
      id: 'user_123',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
    };

    const mockRequest = {
      json: () => Promise.resolve({
        type: 'user.created',
        data: mockUserData,
      } as unknown as WebhookEvent),
    } as Request;

    const mockUser = { _id: '123', ...mockUserData };
    (User.findOneAndUpdate as jest.Mock).mockResolvedValue(mockUser);

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(User.findOneAndUpdate).toHaveBeenCalledWith(
      { clerkId: 'user_123' },
      {
        clerkId: 'user_123',
        email: 'test@example.com',
        name: 'testuser',
      },
      { upsert: true, new: true }
    );
    expect(data.message).toBe('Хэрэглэгч амжилттай бүртгэгдлээ');
  });

  it('should handle user deletion', async () => {
    const mockRequest = {
      json: () => Promise.resolve({
        type: 'user.deleted',
        data: { id: 'user_123' },
      } as unknown as WebhookEvent),
    } as Request;

    const response = await POST(mockRequest);
    const data = await response.json();

    expect(User.findOneAndDelete).toHaveBeenCalledWith({ clerkId: 'user_123' });
    expect(data.message).toBe('Хэрэглэгч амжилттай устгагдлаа');
  });

  it('should handle invalid user data', async () => {
    const mockRequest = {
      json: () => Promise.resolve({
        type: 'user.created',
        data: { invalid: 'data' },
      } as unknown as WebhookEvent),
    } as Request;

    const response = await POST(mockRequest);
    const data = await response.text();
    expect(response.status).toBe(400);
    expect(data).toBe('Хэрэглэгчийн мэдээлэл буруу байна');
  });

  it('should handle unknown event types', async () => {
    const mockRequest = {
      json: () => Promise.resolve({
        type: 'unknown.event',
        data: { id: 'user_123' },
      } as unknown as WebhookEvent),
    } as Request;

    const response = await POST(mockRequest);
    const data = await response.json();
    expect(data.message).toBe('webhook');
  });
}); 