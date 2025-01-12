import * as winston from 'winston';
import { handleApiError } from '../../../src/utils/handle-errors/handle-api-error';
import { logAndThrowError } from '../../../src/utils/handle-errors/log-and-throw-error';

jest.mock('winston', () => {
  const originalModule = jest.requireActual('winston');
  return {
    ...originalModule,
    createLogger: jest.fn(() => ({ error: jest.fn(), info: jest.fn() })),
    format: {
      ...originalModule.format,
      timestamp: jest.fn(() => ({ format: jest.fn() })),
      combine: jest.fn(),
      simple: jest.fn(),
    },
  };
});

const errorMessage = 'Test error message';

describe('handleApiError', () => {
  it('1. Should log error and throw', () => {
    const operation = 'testOperation';
    const error = new Error(errorMessage);

    const loggerErrorSpy = jest.spyOn(winston, 'createLogger');

    expect(() => handleApiError(operation, error)).toThrowError(error);
    expect(loggerErrorSpy).toHaveBeenCalled();
    expect(loggerErrorSpy.mock.results[0].value.error).toHaveBeenCalledWith(`Error during ${operation}: ${errorMessage}`);
  });
});

describe('logAndThrow', () => {
  it('1. Should log error message and throw', () => {
    const loggerErrorSpy = jest.spyOn(winston, 'createLogger');

    expect(() => logAndThrowError(errorMessage)).toThrowError(Error);
    expect(loggerErrorSpy).toHaveBeenCalled();
    expect(loggerErrorSpy.mock.results[0].value.error).toHaveBeenCalledWith(errorMessage);
  });

  it('2. Should log error message and error object if provided', () => {
    const error = new Error('Test error');
    const loggerErrorSpy = jest.spyOn(winston, 'createLogger');

    expect(() => logAndThrowError(errorMessage, error)).toThrowError(error);
    expect(loggerErrorSpy).toHaveBeenCalled();
    expect(loggerErrorSpy.mock.results[0].value.error).toHaveBeenCalledWith(errorMessage);
    expect(loggerErrorSpy.mock.results[0].value.error).toHaveBeenCalledWith(error.message);
  });
});
