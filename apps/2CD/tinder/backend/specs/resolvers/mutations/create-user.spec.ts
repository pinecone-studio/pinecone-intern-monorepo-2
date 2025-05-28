import User from 'src/models/user';
// import mockingoose from 'mockingoose';
import { createUser } from 'src/resolvers/mutations/user/create-user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('createUser', () => {
  const mockSave = jest.fn();
  const mockUserInstance = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    age: 22,
    gender: 'Male',
    lookingFor: 'Female',
    images: ['img1', 'img2'],
    save: mockSave,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    jest.spyOn(User, 'findById').mockResolvedValue(mockUserInstance as { [key: string]: unknown });
    jest.spyOn(User.prototype, 'save').mockImplementation(mockSave);
    (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue('hashedpassword');
    (jest.spyOn(jwt, 'sign') as jest.Mock).mockReturnValue('jwt-token');
    (jest.spyOn(User, 'create') as jest.Mock).mockResolvedValue(mockUserInstance);
  });

  it('should create a user and return token', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    const args = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      age: 22,
      gender: 'Male',
      lookingFor: 'Female',
      images: ['img1', 'img2'],
    };
    try {
      const result = await createUser({}, args);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toMatchObject({
        name: args.name,
        email: args.email,
        password: 'hashedpassword',
        age: args.age,
        gender: args.gender,
        lookingFor: args.lookingFor,
        images: args.images,
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error('createUser threw:', e.message, e.stack);
      } else {
        console.error('createUser threw:', e);
      }
      throw e;
    }
  });

  it('should throw if age is less than 18', async () => {
    const args = { ...mockUserInstance, age: 17 };
    await expect(createUser({}, args)).rejects.toThrow('18 хүрсэн байх шаардлагатай');
  });

  it('should throw if gender is invalid', async () => {
    const args = { ...mockUserInstance, gender: 'Invalid' };
    await expect(createUser({}, args)).rejects.toThrow('Хүйсээ сонгоно уу');
  });

  it('should throw if lookingFor is invalid', async () => {
    const args = { ...mockUserInstance, lookingFor: 'Alien' };
    await expect(createUser({}, args)).rejects.toThrow('Сонихрол сонгоно уу');
  });

  it('should throw if email already exists', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(mockUserInstance);
    const args = { ...mockUserInstance };
    await expect(createUser({}, args)).rejects.toThrow('Хэрэглэгч аль хэдийн байна');
  });

  it('should throw if name is already taken', async () => {
    jest.spyOn(User, 'findOne')
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(mockUserInstance);
    const args = { ...mockUserInstance };
    await expect(createUser({}, args)).rejects.toThrow('Нэр аль хэдийн бүртгэлтэй байна');
  });

  it('should throw if images are less than 2', async () => {
    const args = { ...mockUserInstance, images: ['img1'] };
    await expect(createUser({}, args)).rejects.toThrow('Дор хаяж 2 зураг сонгох шаардлагатай');
  });

  it('should throw mongoose validation error', async () => {
    jest.spyOn(User.prototype, 'save').mockImplementation(() => {
      const err = new Error('Validation Error');
      (err as Error & { errors?: unknown }).errors = { images: { path: 'images', message: 'At least two images are required' } };
      throw err;
    });
    const args = { ...mockUserInstance };
    await expect(createUser({}, args)).rejects.toThrow('Validation Error');
  });

  it('should throw unexpected error', async () => {
    (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockImplementation(() => {
      throw new Error('Unexpected');
    });
    const args = { ...mockUserInstance };
    await expect(createUser({}, args)).rejects.toThrow('Unexpected');
  });
});
