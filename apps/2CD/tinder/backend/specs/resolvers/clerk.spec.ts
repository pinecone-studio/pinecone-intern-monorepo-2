import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../src/pages/api/webhooks/clerk';
import User from '../../src/models/user';

// Mock the database connection
jest.mock('../../src/utils/connect-to-db', () => ({
  connectToDb: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../src/models/user', () => ({
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
}));

describe('Clerk Webhook Handler', () => {
  const originalWarn = console.warn;
  const originalError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  afterAll(() => {
    jest.resetAllMocks();
    console.warn = originalWarn;
    console.error = originalError;
  });

  const createMockRequest = (body: unknown): Partial<NextApiRequest> => ({
    method: 'POST',
    body,
  });

  const createMockResponse = (): Partial<NextApiResponse> => {
    const res: Partial<NextApiResponse> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('should handle user creation with username', async () => {
    /* eslint-disable camelcase */
    const mockUserData = {
      id: 'user_123',
      email_addresses: [{ email_address: 'test@example.com' }],
      username: 'testuser',
      first_name: 'Test',
      last_name: 'User',
    };
    /* eslint-enable camelcase */

    const req = createMockRequest({ type: 'user.created', data: mockUserData });
    const res = createMockResponse();

    (User.findOneAndUpdate as jest.Mock).mockResolvedValue({ _id: '1', ...mockUserData });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(User.findOneAndUpdate).toHaveBeenCalledWith(
      { clerkId: 'user_123' },
      { clerkId: 'user_123', email: 'test@example.com', name: 'testuser' },
      { upsert: true, new: true }
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Хэрэглэгч амжилттай бүртгэгдлээ' }));
  });

  it('should handle user update with first and last name', async () => {
    /* eslint-disable camelcase */
    const mockUserData = {
      id: 'user_456',
      email_addresses: [{ email_address: 'update@example.com' }],
      first_name: 'Update',
      last_name: 'User',
    };
    /* eslint-enable camelcase */

    const req = createMockRequest({ type: 'user.updated', data: mockUserData });
    const res = createMockResponse();

    (User.findOneAndUpdate as jest.Mock).mockResolvedValue({ _id: '2', ...mockUserData });

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(User.findOneAndUpdate).toHaveBeenCalledWith(
      { clerkId: 'user_456' },
      { clerkId: 'user_456', email: 'update@example.com', name: 'Update User' },
      { upsert: true, new: true }
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Хэрэглэгч амжилттай бүртгэгдлээ' }));
  });

  it('should return 400 if required fields are missing', async () => {
    const req = createMockRequest({ type: 'user.created', data: { invalid: 'data' } });
    const res = createMockResponse();

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Хэрэглэгчийн мэдээлэл буруу байна' }));
  });

  it('should handle user deletion', async () => {
    const req = createMockRequest({ type: 'user.deleted', data: { id: 'user_789' } });
    const res = createMockResponse();

    (User.findOneAndDelete as jest.Mock).mockResolvedValue({});

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(User.findOneAndDelete).toHaveBeenCalledWith({ clerkId: 'user_789' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Хэрэглэгч амжилттай устгагдлаа' }));
  });

  it('should handle unknown event types', async () => {
    const req = createMockRequest({ type: 'unknown.event', data: { id: 'user_000' } });
    const res = createMockResponse();

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Танигдаагүй event төрөл' }));
  });

  it('should reject non-POST methods', async () => {
    const req = { method: 'GET', body: {} } as NextApiRequest;
    const res = createMockResponse();

    await handler(req, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Зөвхөн POST хүсэлтийг хүлээн авна' }));
  });
});
