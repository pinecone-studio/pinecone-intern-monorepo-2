//update-user-mutation.ts
import { User } from "src/models";
import { UpdateUserInput } from "src/generated";
import { GraphQLError } from "graphql";
import { Context } from "src/types";

const buildSearchConditions = (input: UpdateUserInput) => {
  const conditions = [];
  
  if (input.userName) {
    conditions.push({ userName: input.userName });
  }
  if (input.email) {
    conditions.push({ email: input.email });
  }
  if (input.phoneNumber) {
    conditions.push({ phoneNumber: input.phoneNumber });
  }
  
  return conditions;
};

const buildUserSearchQuery = (input: UpdateUserInput, currentUserId: string) => {
  const conditions = buildSearchConditions(input);
  
  return conditions.length > 0 ? {
    $and: [
      { _id: { $ne: currentUserId } },
      { $or: conditions }
    ]
  } : null;
};

type ExistingUser = {
  userName: string;
  email?: string;
  phoneNumber?: string;
};

const checkUsernameConflict = (existingUser: ExistingUser, input: UpdateUserInput) => {
  if (input.userName && existingUser.userName === input.userName) {
    throw new GraphQLError('Username already exists', {
      extensions: { code: 'USERNAME_EXISTS' }
    });
  }
};

const checkEmailConflict = (existingUser: ExistingUser, input: UpdateUserInput) => {
  if (input.email && existingUser.email === input.email) {
    throw new GraphQLError('Email already exists', {
      extensions: { code: 'EMAIL_EXISTS' }
    });
  }
};

const checkPhoneConflict = (existingUser: ExistingUser, input: UpdateUserInput) => {
  if (input.phoneNumber && existingUser.phoneNumber === input.phoneNumber) {
    throw new GraphQLError('Phone number already exists', {
      extensions: { code: 'PHONE_EXISTS' }
    });
  }
};

const validateUserConflict = (existingUser: ExistingUser, input: UpdateUserInput) => {
  checkUsernameConflict(existingUser, input);
  checkEmailConflict(existingUser, input);
  checkPhoneConflict(existingUser, input);
};

const performUserUpdate = async (userId: string, input: UpdateUserInput) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: input },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new GraphQLError('Failed to update user', {
      extensions: { code: 'UPDATE_FAILED' }
    });
  }

  return updatedUser.toObject();
};

const checkExistingUser = async (input: UpdateUserInput, currentUserId: string) => {
  const searchQuery = buildUserSearchQuery(input, currentUserId);
  
  if (!searchQuery) return;
  
  const existingUser = await User.findOne(searchQuery);
  
  if (existingUser) {
    validateUserConflict(existingUser, input);
  }
};

export const updateUser = async (
  _: unknown, 
  { _id, input }: { _id: string; input: UpdateUserInput }, 
  _context: Context
) => {
  try {
    // Uncomment it  when authentication is implemented tiim bolhoor hulee
    // const currentUser = await getUserFromToken(extractTokenFromHeader(_context.req.headers.authorization));
    
    const user = await User.findById(_id);
    if (!user) {
      throw new GraphQLError('User not found', {
        extensions: { code: 'USER_NOT_FOUND' }
      });
    }

    await checkExistingUser(input, _id);
    return await performUserUpdate(_id, input);
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Failed to update user', {
      extensions: { code: 'USER_UPDATE_FAILED' }
    });
  }
};