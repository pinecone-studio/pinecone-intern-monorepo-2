import { registerUser } from '../../../../src/resolvers/mutations/user/register-user';
import User from '../../../../src/models/user';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

jest.mock('../../../../src/models/user');
jest.mock('bcryptjs');

describe('createUser resolver', () => {
  const baseInput = {
    name: 'TestUser',
    email: 'test@example.com',
    password: 'password123',
    age: 25,
    gender: 'Male',
    lookingFor: 'Female',
    images: ['img1.jpg', 'img2.jpg'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a user successfully', async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce(null).mockResolvedValueOnce(null); // email, name
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    const savedUser = { ...baseInput, _id: 'user123' };
    const saveMock = jest.fn().mockResolvedValue(savedUser);
    (User as any).mockImplementation(() => ({
      save: saveMock,
      ...savedUser,
    }));

    const result = await registerUser({}, baseInput);

    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(saveMock).toHaveBeenCalled();
    expect(result).toMatchObject({ name: 'TestUser', email: 'test@example.com' });
  });

  it('throws if underage', async () => {
    await expect(registerUser({}, { ...baseInput, age: 17 })).rejects.toThrow('18 хүрсэн байх шаардлагатай');
  });

  it('throws if gender is invalid', async () => {
    await expect(registerUser({}, { ...baseInput, gender: 'Alien' })).rejects.toThrow('Хүйсээ сонгоно уу');
  });

  it('throws if lookingFor is invalid', async () => {
    await expect(registerUser({}, { ...baseInput, lookingFor: 'Nobody' })).rejects.toThrow('Сонихрол сонгоно уу');
  });

  it('throws if less than 2 images', async () => {
    await expect(registerUser({}, { ...baseInput, images: ['onlyOne.jpg'] })).rejects.toThrow('Дор хаяж 2 зураг сонгох шаардлагатай');
  });

  it('throws if email already exists', async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce({ email: 'test@example.com' }); // email check
    await expect(registerUser({}, baseInput)).rejects.toThrow('Хэрэглэгч аль хэдийн байна');
  });

  it('throws if name already exists', async () => {
    (User.findOne as jest.Mock).mockResolvedValueOnce(null).mockResolvedValueOnce({ name: 'TestUser' }); // name check
    await expect(registerUser({}, baseInput)).rejects.toThrow('Нэр аль хэдийн бүртгэлтэй байна');
  });

  it('throws mongoose validation error', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    const mockErr = new mongoose.Error.ValidationError({} as any);
    mockErr.addError('email', new mongoose.Error.ValidatorError({ message: 'Invalid email', path: 'email' }));

    (User as any).mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(mockErr),
    }));

    await expect(registerUser({}, baseInput)).rejects.toThrow('Validation Error');
  });

  it('throws unknown error', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    (User as any).mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error('Something exploded')),
    }));

    await expect(registerUser({}, baseInput)).rejects.toThrow('Something exploded');
  });
});
