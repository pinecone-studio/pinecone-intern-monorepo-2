import { UserInputError } from 'apollo-server-express';
import bcrypt from 'bcryptjs';
import User from '../../../models/user';
import mongoose from 'mongoose';

function validateAge(age: number) {
  if (age < 18) {
    throw new UserInputError('18 хүрсэн байх шаардлагатай', { field: 'age', value: age });
  }
}

function validateGender(gender: string) {
  if (!['Male', 'Female', 'Other'].includes(gender)) {
    throw new UserInputError('Хүйсээ сонгоно уу', { field: 'gender', value: gender });
  }
}

function validateLookingFor(lookingFor: string) {
  if (!['Male', 'Female', 'Both'].includes(lookingFor)) {
    throw new UserInputError('Сонихрол сонгоно уу', { field: 'lookingFor', value: lookingFor });
  }
}

async function checkExistingUser(email: string) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new UserInputError('Хэрэглэгч аль хэдийн байна', { field: 'email', value: email });
  }
}

async function checkExistingName(name: string) {
  const existingName = await User.findOne({ name });
  if (existingName) {
    throw new UserInputError('Нэр аль хэдийн бүртгэлтэй байна', { field: 'name', value: name });
  }
}

function validateImages(images?: string[]) {
  if (!images || images.length < 2) {
    throw new UserInputError('Дор хаяж 2 зураг сонгох шаардлагатай', { field: 'images', value: images });
  }
}

export const registerUser = async (
  _: { [key: string]: unknown },
  {
    name,
    email,
    password,
    age,
    gender,
    lookingFor,
    likes,
    images,
  }: {
    name: string;
    email: string;
    password: string;
    age: number;
    likes?: string[];
    gender: string;
    lookingFor: string;
    images?: string[];
  }
) => {
  try {
    validateAge(age);
    validateGender(gender);
    validateLookingFor(lookingFor);
    await checkExistingUser(email);
    await checkExistingName(name);
    validateImages(images);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      lookingFor,
      images,
      likes,
    });

    await user.save();

    return user;
  } catch (error: unknown) {
    if (error instanceof UserInputError) {
      throw error;
    }
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));
      throw new UserInputError('Validation Error', { validationErrors });
    }
    throw error;
  }
};
