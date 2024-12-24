import { userModel } from '../../../../../src/models';
import { setPassword } from '../../../../../src/resolvers/mutations';
import { Response } from 'src/generated';
import bcrypt from 'bcrypt';

jest.mock('../../../../../src/models', () => ({
  userModel: {
    create: jest.fn(),
  },
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('setPassword', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user with the provided email and hashed password', async () => {
    const input = { email: 'test@gmail.com', password: 'securePassword123' };
    const hashedPassword = 'hashedPassword';

    (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);

    const mockedUser = {
      email: input.email,
      save: jest.fn().mockResolvedValueOnce(null),
    };
    (userModel.create as jest.Mock).mockResolvedValueOnce(mockedUser);

    const result = await setPassword({}, { input });

    expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
    expect(userModel.create).toHaveBeenCalledWith({
      email: input.email,
      password: hashedPassword,
    });
    expect(mockedUser.save).toHaveBeenCalled();
    expect(result).toEqual(Response.Success);
  });

  it('should throw an error if userModel.create returns null', async () => {
    const input = { email: 'test@gmail.com', password: 'securePassword123' };
    const hashedPassword = 'hashedPassword';

    (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);

    (userModel.create as jest.Mock).mockResolvedValueOnce(null);

    await expect(setPassword({}, { input })).rejects.toThrow('Database error');

    expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
    expect(userModel.create).toHaveBeenCalledWith({
      email: input.email,
      password: hashedPassword,
    });
  });

  it('should throw an error if save fails', async () => {
    const input = { email: 'test@gmail.com', password: 'securePassword123' };
    const hashedPassword = 'hashedPassword';

    (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);

    const mockedUser = {
      email: input.email,
      save: jest.fn().mockRejectedValueOnce(new Error('Save error')),
    };
    (userModel.create as jest.Mock).mockResolvedValueOnce(mockedUser);

    await expect(setPassword({}, { input })).rejects.toThrow('Save error');

    expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
    expect(userModel.create).toHaveBeenCalledWith({
      email: input.email,
      password: hashedPassword,
    });
    expect(mockedUser.save).toHaveBeenCalled();
  });
});
