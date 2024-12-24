import { userModel } from '../../../../../src/models';
import { setPassword } from '../../../../../src/resolvers/mutations';
import { Response } from 'src/generated';
import bcrypt from 'bcrypt';

// Mocking modules
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
    // Arrange
    const input = { email: 'test@gmail.com', password: 'securePassword123' };
    const hashedPassword = 'hashedPassword';

    // Mock bcrypt.hash to return the hashed password
    (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);

    // Mock userModel.create to return a user object
    const mockedUser = {
      email: input.email,
      save: jest.fn().mockResolvedValueOnce(null),
    };
    (userModel.create as jest.Mock).mockResolvedValueOnce(mockedUser);

    // Act
    const result = await setPassword({}, { input });

    // Assert
    expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
    expect(userModel.create).toHaveBeenCalledWith({
      email: input.email,
      password: hashedPassword,
    });
    expect(mockedUser.save).toHaveBeenCalled();
    expect(result).toEqual(Response.Success);
  });

  it('should throw an error if userModel.create returns null', async () => {
    // Arrange
    const input = { email: 'test@gmail.com', password: 'securePassword123' };
    const hashedPassword = 'hashedPassword';

    // Mock bcrypt.hash to return the hashed password
    (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);

    // Mock userModel.create to return null
    (userModel.create as jest.Mock).mockResolvedValueOnce(null);

    // Act & Assert
    await expect(setPassword({}, { input })).rejects.toThrow('Database error');

    expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
    expect(userModel.create).toHaveBeenCalledWith({
      email: input.email,
      password: hashedPassword,
    });
  });

  it('should throw an error if save fails', async () => {
    // Arrange
    const input = { email: 'test@gmail.com', password: 'securePassword123' };
    const hashedPassword = 'hashedPassword';

    // Mock bcrypt.hash to return the hashed password
    (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);

    // Mock userModel.create to return a user object
    const mockedUser = {
      email: input.email,
      save: jest.fn().mockRejectedValueOnce(new Error('Save error')),
    };
    (userModel.create as jest.Mock).mockResolvedValueOnce(mockedUser);

    // Act & Assert
    await expect(setPassword({}, { input })).rejects.toThrow('Save error');

    expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
    expect(userModel.create).toHaveBeenCalledWith({
      email: input.email,
      password: hashedPassword,
    });
    expect(mockedUser.save).toHaveBeenCalled();
  });
});
