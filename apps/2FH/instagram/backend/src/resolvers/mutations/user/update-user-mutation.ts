// apps/2FH/instagram/backend/src/resolvers/mutations/user/update-user-mutation.ts
import { User } from "src/models";
import { UpdateUserInput } from "src/generated";
import { GraphQLError } from "graphql";
import { ContextUser } from "src/types/context-user";
import { requireAuthentication, validateUserOwnership } from "src/utils/auth";

const buildSearchConditions = (input: UpdateUserInput) => {
  const fieldMappings = [
    { field: 'userName', value: input.userName },
    { field: 'email', value: input.email },
    { field: 'phoneNumber', value: input.phoneNumber }
  ];
  
  return fieldMappings
    .filter(mapping => mapping.value)
    .map(mapping => ({ [mapping.field]: mapping.value }));
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

const validateUserConflict = (existingUser: ExistingUser, input: UpdateUserInput) => {
  const conflictChecks = [
    {
      inputValue: input.userName,
      existingValue: existingUser.userName,
      error: 'Username already exists',
      code: 'USERNAME_EXISTS'
    },
    {
      inputValue: input.email,
      existingValue: existingUser.email,
      error: 'Email already exists',
      code: 'EMAIL_EXISTS'
    },
    {
      inputValue: input.phoneNumber,
      existingValue: existingUser.phoneNumber,
      error: 'Phone number already exists',
      code: 'PHONE_EXISTS'
    }
  ];

  const conflict = conflictChecks.find(check => 
    check.inputValue && check.existingValue === check.inputValue
  );

  if (conflict) {
    throw new GraphQLError(conflict.error, {
      extensions: { code: conflict.code }
    });
  }
};

const checkExistingUser = async (input: UpdateUserInput, currentUserId: string) => {
  const searchQuery = buildUserSearchQuery(input, currentUserId);
  
  if (!searchQuery) return;
  
  const existingUser = await User.findOne(searchQuery);
  
  if (existingUser) {
    validateUserConflict(existingUser, input);
  }
};

const performUserUpdate = async (userId: string, input: UpdateUserInput) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: input },
    { new: true, runValidators: true }
  );
  
  if (!updatedUser) {
    throw new GraphQLError('Failed to update user', {
      extensions: { code: 'USER_UPDATE_FAILED' }
    });
  }
  
  return updatedUser.toObject();
};

const validateUserExists = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new GraphQLError('User not found', {
      extensions: { code: 'USER_NOT_FOUND' }
    });
  }
  return user;
};

const executeUserUpdate = async (_id: string, input: UpdateUserInput) => {
  await checkExistingUser(input, _id);
  return await performUserUpdate(_id, input);
};

export const updateUser = async (
  _: unknown, 
  { _id, input }: { _id: string; input: UpdateUserInput }, // Changed id to _id
  context: ContextUser
) => {
  try {
    const authenticatedUserId = requireAuthentication(context);
    validateUserOwnership(authenticatedUserId, _id, 'update this profile'); // Changed id to _id
    await validateUserExists(_id); // Changed id to _id
    return await executeUserUpdate(_id, input); // Changed id to _id
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError('Failed to update user', {
      extensions: { code: 'USER_UPDATE_FAILED' }
    });
  }
};