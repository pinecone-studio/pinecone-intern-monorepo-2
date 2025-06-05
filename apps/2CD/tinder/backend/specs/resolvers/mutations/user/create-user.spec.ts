import { registerUser } from '../../../../src/resolvers/mutations/user/register-user';
import User from '../../../../src/models/user';
import bcrypt from 'bcryptjs';
import { GraphQLError } from 'graphql';
import mongoose from 'mongoose';

jest.mock('../../../../src/models/user');
jest.mock('bcryptjs');

describe('registerUser', () => {
  interface RegisterUserInput {
    name: string;
    email: string;
    password: string;
    age?: number;
    gender?: string;
    lookingFor?: string;
    images?: string[];
  }

  const baseInput: RegisterUserInput = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    age: 25,
    gender: 'Male',
    lookingFor: 'Female',
    images: ['image1.jpg', 'image2.jpg']
  };

  const mockUserData = {
    _id: 'user123',
    ...baseInput,
    password: 'hashedPassword'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    (User as unknown as jest.Mock).mockImplementation(() => ({
      ...mockUserData,
      save: jest.fn().mockResolvedValue(undefined),
      toObject: () => mockUserData
    }));
  });

  it('should register a new user successfully', async () => {
    const result = await registerUser({}, { input: baseInput });
    expect(result).toEqual(mockUserData);
    expect(User).toHaveBeenCalledWith({
      ...baseInput,
      password: 'hashedPassword'
    });
  });

  describe('validation and checks', () => {
    const validationTests = [
      { field: 'email', value: 'invalid-email', message: 'Invalid email format' },
      { field: 'password', value: '123', message: 'Password must be at least 6 characters long' },
      { field: 'age', value: 15, message: '18 хүрсэн байх шаардлагатай' },
      { field: 'gender', value: 'invalid', message: 'Хүйсээ сонгоно уу' },
      { field: 'lookingFor', value: 'invalid', message: 'Сонихрол сонгоно уу' },
      { field: 'images', value: [], message: 'Дор хаяж 2 зураг сонгох шаардлагатай' },
      { field: 'images', value: Array(7).fill('image.jpg'), message: 'Хамгийн ихдээ 6 зураг' }
    ];

    validationTests.forEach(({ field, value, message }) => {
      it(`should validate ${field} correctly`, async () => {
        const input = { ...baseInput, [field]: value };
        await expect(registerUser({}, { input }))
          .rejects.toThrow(new GraphQLError(message, {
            extensions: { code: 'BAD_USER_INPUT', field, value }
          }));
      });
    });

    it('should check for existing email and name', async () => {
      (User.findOne as jest.Mock).mockResolvedValueOnce({ email: baseInput.email });
      await expect(registerUser({}, { input: baseInput }))
        .rejects.toThrow(new GraphQLError('Хэрэглэгч бүртгэлтэй байна', {
          extensions: { code: 'BAD_USER_INPUT', field: 'email', value: baseInput.email }
        }));

      (User.findOne as jest.Mock).mockResolvedValueOnce(null).mockResolvedValueOnce({ name: baseInput.name });
      await expect(registerUser({}, { input: baseInput }))
        .rejects.toThrow(new GraphQLError('Нэр бүртгэгдсэн байна', {
          extensions: { code: 'BAD_USER_INPUT', field: 'name', value: baseInput.name }
        }));
    });
  });

  describe('error handling', () => {
    it('should handle validation errors', async () => {
      const error = new mongoose.Error.ValidationError();
      error.errors = {
        name: { path: 'name', message: 'Name is required', value: undefined } as mongoose.Error.ValidatorError
      };
      (User as unknown as jest.Mock).mockImplementationOnce(() => ({
        ...mockUserData,
        save: jest.fn().mockRejectedValue(error),
        toObject: () => mockUserData
      }));

      await expect(registerUser({}, { input: baseInput }))
        .rejects.toThrow(new GraphQLError('Validation Error', {
          extensions: { 
            code: 'BAD_USER_INPUT',
            validationErrors: [{ field: 'name', message: 'Name is required' }]
          }
        }));
    });

    it('should handle unknown errors', async () => {
      (User as unknown as jest.Mock).mockImplementationOnce(() => ({
        ...mockUserData,
        save: jest.fn().mockRejectedValue(new Error('Unknown error')),
        toObject: () => mockUserData
      }));

      await expect(registerUser({}, { input: baseInput }))
        .rejects.toThrow('Unknown error');
    });
  });
});
