import { GraphQLError } from 'graphql';
import bcrypt from 'bcryptjs';
import User from '../../../models/user';
import mongoose from 'mongoose';

function validateAge(age: number) {
  if (age < 18) {
    throw new GraphQLError('18 хүрсэн байх шаардлагатай', {
      extensions: { code: 'BAD_USER_INPUT', field: 'age', value: age }
    });
  }
}

function validateGender(gender: string) {
  if (!['Male', 'Female', 'Other'].includes(gender)) {
    throw new GraphQLError('Хүйсээ сонгоно уу', {
      extensions: { code: 'BAD_USER_INPUT', field: 'gender', value: gender }
    });
  }
}

function validateLookingFor(lookingFor: string) {
  if (!['Male', 'Female', 'Both'].includes(lookingFor)) {
    throw new GraphQLError('Сонихрол сонгоно уу', {
      extensions: { code: 'BAD_USER_INPUT', field: 'lookingFor', value: lookingFor }
    });
  }
}

function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new GraphQLError('Invalid email format', {
      extensions: { code: 'BAD_USER_INPUT', field: 'email', value: email }
    });
  }
}

function validatePassword(password: string) {
  if (password.length < 6) {
    throw new GraphQLError('Password must be at least 6 characters long', {
      extensions: { code: 'BAD_USER_INPUT', field: 'password', value: password }
    });
  }
}

function validateImages(images?: string[]) {
  if (!images || images.length < 2) {
    throw new GraphQLError('Дор хаяж 2 зураг сонгох шаардлагатай', {
      extensions: { code: 'BAD_USER_INPUT', field: 'images', value: images }
    });
  }
  if (images.length > 6) {
    throw new GraphQLError('Хамгийн ихдээ 6 зураг', {
      extensions: { code: 'BAD_USER_INPUT', field: 'images', value: images }
    });
  }
}

async function checkExistingUser(email: string) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new GraphQLError('Хэрэглэгч бүртгэлтэй байна', {
      extensions: { code: 'BAD_USER_INPUT', field: 'email', value: email }
    });
  }
}

async function checkExistingName(name: string) {
  const existingName = await User.findOne({ name });
  if (existingName) {
    throw new GraphQLError('Нэр бүртгэгдсэн байна', {
      extensions: { code: 'BAD_USER_INPUT', field: 'name', value: name }
    });
  }
}

interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  age?: number;
  gender?: string;
  lookingFor?: string;
  images?: string[];
}

function validateRequiredFields(input: RegisterUserInput) {
  validateEmail(input.email);
  validatePassword(input.password);
  if (input.age !== undefined) validateAge(input.age);
  if (input.gender !== undefined) validateGender(input.gender);
}

function validateOptionalFields(input: RegisterUserInput) {
  if (input.lookingFor !== undefined) validateLookingFor(input.lookingFor);
  if (input.images !== undefined) validateImages(input.images);
}

function validateInput(input: RegisterUserInput) {
  validateRequiredFields(input);
  validateOptionalFields(input);
}

async function createUser(input: RegisterUserInput, hashedPassword: string) {
  const user = new User({
    ...input,
    password: hashedPassword,
  });
  await user.save();
  return user.toObject();
}

function handleValidationError(error: mongoose.Error.ValidationError) {
  const validationErrors = Object.values(error.errors).map((err) => ({
    field: err.path,
    message: err.message,
  }));
  throw new GraphQLError('Validation Error', {
    extensions: { code: 'BAD_USER_INPUT', validationErrors }
  });
}

export const registerUser = async (
  _: { [key: string]: unknown },
  { input }: { input: RegisterUserInput }
) => {
  try {
    validateInput(input);
    await checkExistingUser(input.email);
    await checkExistingName(input.name);

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = await createUser(input, hashedPassword);
    return user;
  } catch (error: unknown) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    if (error instanceof mongoose.Error.ValidationError) {
      handleValidationError(error);
    }
    throw error;
  }
};
