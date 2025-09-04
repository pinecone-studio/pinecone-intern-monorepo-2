import { GraphQLError } from 'graphql';

const validateError = (error: unknown, errorToThrow: Error | GraphQLError, expectedError?: GraphQLError): void => {
  if (expectedError) {
    expect(error).toBeInstanceOf(GraphQLError);
    expect((error as GraphQLError).message).toBe(expectedError.message);
  } else if (error instanceof GraphQLError) {
    expect(error.message).toBe(errorToThrow.message);
  } else if (error instanceof Error) {
    expect(error.message).toBe(errorToThrow.message);
  } else {
    throw error;
  }
};

export const setupMockAndExpectError = async (
  mockFunction: jest.Mock,
  errorToThrow: Error | GraphQLError,
  functionToTest: () => Promise<any>,
  expectedError?: GraphQLError,
  additionalChecks?: () => void
) => {
  mockFunction.mockRejectedValue(errorToThrow);
  
  try {
    await functionToTest();
    throw new Error('Expected function to throw but it did not');
  } catch (error) {
    validateError(error, errorToThrow, expectedError);
    
    if (additionalChecks) {
      additionalChecks();
    }
  }
};

export const createMockUserInput = () => ({
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
  dateOfBirth: '1990-01-01',
  gender: 'male',
  bio: 'Test bio',
  interests: ['coding', 'music'],
  profession: 'Developer',
  work: 'Tech Company',
  images: ['image1.jpg']
});

export const createMockProfile = () => ({
  _id: '507f1f77bcf86cd799439011',
  userId: '507f1f77bcf86cd799439012',
  name: 'Test User',
  gender: 'male',
  bio: 'Test bio',
  interests: ['coding', 'music'],
  profession: 'Developer',
  work: 'Tech Company',
  images: ['image1.jpg'],
  dateOfBirth: '1990-01-01',
  createdAt: new Date('2020-01-01'),
  updatedAt: new Date('2020-01-02')
});
export const createMockMessage = () => ({
  _id: '507f1f77bcf86cd799439013',
  senderId: '507f1f77bcf86cd799439012',
  receiverId: '507f1f77bcf86cd799439014',
  content: 'Hello world',
  timestamp: new Date('2020-01-01'),
  isRead: false
});
