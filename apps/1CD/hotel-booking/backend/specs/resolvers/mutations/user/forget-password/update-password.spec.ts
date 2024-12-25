import { updatePassword } from 'src/resolvers/mutations';
import { userModel } from '../../../../../src/models';
import bcrypt from 'bcrypt';
import { Response } from 'src/generated';

jest.mock('../../../../../src/models', () => ({
  userModel: {
    findOneAndUpdate: jest.fn(),
  },
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('updatePassword', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should hash the password, update the user, and return Response.Success', async () => {
    const input = { email: 'test@gmail.com', password: 'securePassword123' };
    const hashedPassword = 'hashedPassword';

    (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);

    const mockedUser = {
      email: input.email,
      save: jest.fn().mockResolvedValueOnce(null),
    };
    (userModel.findOneAndUpdate as jest.Mock).mockResolvedValueOnce(mockedUser);

    const result = await updatePassword({}, { input });

    expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
    expect(userModel.findOneAndUpdate).toHaveBeenCalledWith({ email: input.email }, { password: hashedPassword });
    expect(mockedUser.save).toHaveBeenCalled();
    expect(result).toEqual(Response.Success);
  });

  it('should throw an error if no user is found', async () => {
    const input = { email: 'nonexistent@gmail.com', password: 'securePassword123' };

    (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedPassword');

    (userModel.findOneAndUpdate as jest.Mock).mockResolvedValueOnce(null);

    await expect(updatePassword({}, { input })).rejects.toThrow('User not found');

    expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
    expect(userModel.findOneAndUpdate).toHaveBeenCalledWith({ email: input.email }, { password: 'hashedPassword' });
  });
});
