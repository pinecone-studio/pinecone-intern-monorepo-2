import { UserModel } from 'src/models';
import { createUser } from 'src/resolvers/mutations/user/create-user';
import bcrypt from 'bcryptjs';
jest.mock('src/models', () => ({
  UserModel: { findOne: jest.fn(), create: jest.fn() },
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(async (password) => `hashed-${password}`),
  compare: jest.fn(),
}));

type CreateUserInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  dateOfBirth: string;
};

const validInput: CreateUserInput = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@gmail.com',
  password: 'Ab@12345678',
  role: 'user',
  dateOfBirth: '2000-01-01',
};

describe('Create User', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if email already exists', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue({ email: validInput.email });

    await expect(createUser({}, { input: validInput })).rejects.toThrow(`User with email ${validInput.email} already exists`);

    expect(UserModel.findOne).toHaveBeenCalledWith({ email: validInput.email });
  });
  it('should throw error from catch block if createUser fails', async () => {
    (UserModel.create as jest.Mock).mockImplementation(() => {
      throw new Error(`User with email ${validInput.email} already exists`);
    });

    await expect(createUser({}, { input: validInput })).rejects.toThrow(`Create user DB error:Error: User with email ${validInput.email} already exists`);
  });

  it('should throw new error on password syntax', async () => {
    const invalidInput = { ...validInput, password: '1234' };
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);
    (UserModel.create as jest.Mock).mockImplementation(() => {
      throw new Error(`User with email ${validInput.email} already exists`);
    });
    await expect(createUser({}, { input: invalidInput })).rejects.toThrow(`Password must be at least 8 characters and include uppercase, lowercase, number, and special character.`);
  });

  it('should create user with hashed password when valid input', async () => {
    const hashedPassword = await bcrypt.hash(validInput.password, 10);
    // console.log('hashedPassword', hashedPassword);
    const mockCreatedUser = {
      ...validInput,
      password: hashedPassword,
      toObject: function () {
        return { ...this };
      },
    };

    (UserModel.findOne as jest.Mock).mockResolvedValue(null);
    (UserModel.create as jest.Mock).mockResolvedValue(mockCreatedUser);

    const result = await createUser({}, { input: validInput });

    expect(result).toEqual({
      ...mockCreatedUser,
      password: undefined,
    });

    // expect(UserModel.findOne).toHaveBeenCalledWith({ email: validInput.email });
    // expect(UserModel.create).toHaveBeenCalledWith({
    //   ...validInput,
    //   password: hashedPassword,
    // });
  });
});
