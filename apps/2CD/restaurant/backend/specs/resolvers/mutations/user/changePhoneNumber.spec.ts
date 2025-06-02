import { User } from 'src/models/user.model';
import { changePhoneNumber } from 'src/resolvers/mutations';
import { findUserByEmail } from 'src/resolvers/mutations/user/user-helpers';

jest.mock('src/resolvers/mutations/user/user-helpers', () => ({
  findUserByEmail: jest.fn(),
}));
jest.mock('src/models/user.model', () => ({
  User: {
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('change phone number', () => {
  it('should throw if user is not found', async () => {
    const input = {
      email: 'test@gmail.com',
      newPhoneNumber: 'newPass',
    };

    (findUserByEmail as jest.Mock).mockResolvedValue(null);

    await expect(changePhoneNumber(undefined, { input })).rejects.toThrow('User not found');
    expect(findUserByEmail).toHaveBeenCalledWith('test@gmail.com');
  });

  it('should update new phone number to db', async () => {
    const input = {
      email: 'test@gmail.com',
      newPhoneNumber: '99989898',
    };
    const mockUser = { _id: 'user123', email: 'test@gmail.com' };

    (findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
    (User.findByIdAndUpdate as jest.Mock).mockResolvedValue({});

    const result = await changePhoneNumber(undefined, { input });

    expect(findUserByEmail).toHaveBeenCalledWith('test@gmail.com');
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith('user123', {
      phoneNumber: input.newPhoneNumber,
    });
    expect(result).toEqual({
      success: true,
      message: 'Phone number changed successfuly',
    });
  });
});
