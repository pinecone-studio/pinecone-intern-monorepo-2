//create-user-mutation.ts
import { CreateUserInput } from "src/generated";
import { User } from "src/models/user";
import { GraphQLError } from "graphql";
import { encryptHash, generateOTP, sendVerificationEmail } from "src/utils";
import { otpStorage } from "src/resolvers/mutations/user/forgot-password-mutation";

const buildUserSearchQuery = (input: CreateUserInput) => ({
  $or: [
    { userName: input.userName },
    ...(input.email ? [{ email: input.email }] : []),
    ...(input.phoneNumber ? [{ phoneNumber: input.phoneNumber }] : [])
  ]
});

type ExistingUser = {
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
    followings: [],
    isVerified: false // User starts unverified
  });
};

const storeVerificationOTP = (email: string, otp: string) => {
  const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
  const key = `verification_${email.toLowerCase().trim()}`;
  const expiresAt = Date.now() + OTP_TTL_MS;
  otpStorage.set(key, { otp, expiresAt });
  
  setTimeout(() => {
    const current = otpStorage.get(key);
    if (current && current.expiresAt === expiresAt) {
      otpStorage.delete(key);
    }
  }, OTP_TTL_MS);
};

const handleVerificationEmail = async (email: string) => {
  try {
    const otp = generateOTP();
    storeVerificationOTP(email, otp);
    await sendVerificationEmail(email, otp);
  } catch (emailError) {
    console.error('Failed to send verification email:', emailError);
    // Don't fail user creation if email sending fails
  }
};

const processUserCreation = async (input: CreateUserInput) => {
  await checkExistingUser(input);
  validateContactInfo(input);
  
  const newUser = createUserObject(input);
  await newUser.save();
  
  if (input.email) {
    await handleVerificationEmail(input.email);
  }
  
  const populatedUser = await User.findById(newUser._id)
  .populate('followers', '_id userName fullName profileImage')
  .populate('followings', '_id userName fullName profileImage')
  .populate('posts')
  .populate('stories');
/* istanbul ignore next */
return populatedUser?.toObject();
};

export const createUser = async (
  _parent: unknown, 
  { input }: { input: CreateUserInput }
) => {
  try {
    return await processUserCreation(input);
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Failed to create user', {
      extensions: { code: 'USER_CREATION_FAILED' }
    });
  }
};
