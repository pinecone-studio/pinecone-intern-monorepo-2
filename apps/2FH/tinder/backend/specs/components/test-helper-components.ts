import { GraphQLError } from "graphql";

export const setupMockAndExpectError = async (
  mockFunction: jest.Mock,
  errorValue: any,
  testFunction: () => Promise<any>,
  expectedError: GraphQLError,
  additionalExpectations?: () => void
) => {
  mockFunction.mockRejectedValue(errorValue);
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

  await expect(testFunction()).rejects.toThrow(expectedError);

  if (additionalExpectations) {
    additionalExpectations();
  }

  consoleSpy.mockRestore();
};

export const setupMockAndExpectSuccess = async (
  mockFunction: jest.Mock,
  returnValue: any,
  testFunction: () => Promise<any>,
  additionalExpectations?: () => void
) => {
  mockFunction.mockResolvedValue(returnValue);
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

  await testFunction();

  if (additionalExpectations) {
    additionalExpectations();
  }

  consoleSpy.mockRestore();
};