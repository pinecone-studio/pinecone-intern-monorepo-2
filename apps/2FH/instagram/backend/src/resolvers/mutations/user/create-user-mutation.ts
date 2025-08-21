//create-user-mutation.ts
import { User } from "src/models";
import { CreateUserInput } from "src/generated";
import { encryptHash } from "src/utils";
import { GraphQLError } from "graphql";

const buildUserSearchQuery = (input: CreateUserInput) => ({
  $or: [
    { userName: input.userName },
    ...(input.email ? [{ email: input.email }] : []),
    ...(input.phoneNumber ? [{ phoneNumber: input.phoneNumber }] : [])
  ]
});

type ExistingUser ={
  userName: string;
  email?: string;
  phoneNumber?: string;
}

const checkUsernameConflict = (existingUser: ExistingUser, input: CreateUserInput) => {
  if (existingUser.userName === input.userName) {
    throw new GraphQLError('Username already exists', {
      extensions: { code: 'USERNAME_EXISTS' }
    });
  }
};

const checkEmailConflict = (existingUser: ExistingUser, input: CreateUserInput) => {
  if (input.email && existingUser.email === input.email) {
    throw new GraphQLError('Email already exists', {
      extensions: { code: 'EMAIL_EXISTS' }
    });
  }
};

const checkPhoneConflict = (existingUser: ExistingUser, input: CreateUserInput) => {
  if (input.phoneNumber && existingUser.phoneNumber === input.phoneNumber) {
    throw new GraphQLError('Phone number already exists', {
      extensions: { code: 'PHONE_EXISTS' }
    });
  }
};

const validateUserConflict = (existingUser: ExistingUser, input: CreateUserInput) => {
  checkUsernameConflict(existingUser, input);
  checkEmailConflict(existingUser, input);
  checkPhoneConflict(existingUser, input);
};

const checkExistingUser = async (input: CreateUserInput) => {
  const searchQuery = buildUserSearchQuery(input);
  const existingUser = await User.findOne(searchQuery);
  
  if (existingUser) {
    validateUserConflict(existingUser, input);
  }
};

const validateContactInfo = (input: CreateUserInput) => {
  if (!input.email && !input.phoneNumber) {
    throw new GraphQLError('Either email or phone number is required', {
      extensions: { code: 'CONTACT_REQUIRED' }
    });
  }
};

const createUserObject = (input: CreateUserInput) => {
  const hashedPassword = encryptHash(input.password);
  
  return new User({
    ...input,
    password: hashedPassword,
    posts: [],
    stories: [],
    followers: [],
    followings: []
  });
};

export const createUser = async (
  _parent: unknown, 
  { input }: { input: CreateUserInput }
) => {
  try {
    await checkExistingUser(input);
    validateContactInfo(input);
    
    const newUser = createUserObject(input);
    await newUser.save();
    
    return newUser.toObject();
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Failed to create user', {
      extensions: { code: 'USER_CREATION_FAILED' }
    });
  }
};