import { UserModel } from 'src/models';
import bcrypt from 'bcryptjs';

type CreateUserInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  dateOfBirth: string;
};

const checkDuplicateEmail = async (email: string) => {
  const exists = await UserModel.findOne({ email });

  if (exists) {
    throw new Error(`User with email ${email} already exists`);
  }
};

const validatePassword = (password: string) => {
  const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
  const passwordValid = passwordPolicy.test(password);
  console.log('passwordValid', passwordValid);
  if (!passwordPolicy.test(password)) {
    throw new Error('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
  }
};

export const createUser = async (_: unknown, { input }: { input: CreateUserInput }) => {
  try {
    await checkDuplicateEmail(input.email);
    await validatePassword(input.password);

    const hashedPassword = await bcrypt.hash(input.password, 10);

    console.log('hashedPassword', hashedPassword);
    const newUser = await UserModel.create({
      ...input,
      dateOfBirth: input.dateOfBirth,
      password: hashedPassword,
    });

    console.log('newUser', newUser.toObject());

    return {
      ...newUser.toObject(),
      password: undefined,
    };
  } catch (error) {
    throw new Error(`Create user DB error:${error}`);
  }
};
