import { userModel } from '../../../../src/models';
import { setPassword } from 'src/resolvers/mutations';

jest.mock('../../../../src/models', () => ({
  userModel: {
    create: jest
      .fn()
      .mockResolvedValueOnce({
        email: 'test@gmail.com',
        _id: '1',
        createdAt: new Date(),
        save: jest.fn().mockResolvedValueOnce(null), // Simulating save success
      })
      .mockRejectedValueOnce(new Error('Database error')) // Simulating creation failure
      .mockResolvedValueOnce({
        email: 'test@gmail.com',
        _id: '1',
        createdAt: new Date(),
        save: jest.fn().mockRejectedValueOnce(new Error('Save error')), // Simulating save failure
      }),
  },
}));

describe('setPassword', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user with the provided email and password', async () => {
    const input = { email: 'test@gmail.com', password: 'securePassword123' };

    const result = await setPassword({}, { input });

    expect(userModel.create).toHaveBeenCalledWith({ email: 'test@gmail.com', password: 'securePassword123' });
    expect(result).toEqual({
      email: 'test@gmail.com',
      _id: '1',
      createdAt: expect.any(Date),
    });
  });

  it('should throw an error if userModel.create fails', async () => {
    const input = { email: 'test@gmail.com', password: 'securePassword123' };

    await expect(setPassword({}, { input })).rejects.toThrow('Database error');

    expect(userModel.create).toHaveBeenCalledWith({ email: 'test@gmail.com', password: 'securePassword123' });
  });

  it('should throw an error if save fails', async () => {
    const input = { email: 'test@gmail.com', password: 'securePassword123' };

    await expect(setPassword({}, { input })).rejects.toThrow('Save error');

    expect(userModel.create).toHaveBeenCalledWith({ email: 'test@gmail.com', password: 'securePassword123' });
  });
});
