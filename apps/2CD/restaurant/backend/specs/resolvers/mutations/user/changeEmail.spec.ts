import { User } from 'src/models/user.model';
import { changeEmail } from 'src/resolvers/mutations';

jest.mock('src/models/user.model', () => ({
  User: {
    findByIdAndUpdate: jest.fn(),
  },
}));

describe('changeEmail', () => {
  const input = {
    _id: 'user123',
    newEmail: 'newemail@example.com',
  };

  it('should update the email in the database', async () => {
    (User.findByIdAndUpdate as jest.Mock).mockResolvedValue({});

    const result = await changeEmail(undefined, { input });

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(input._id, {
      email: input.newEmail,
    });
    expect(result).toEqual({
      success: true,
      message: 'Email changed successfuly',
    });
  });
});
