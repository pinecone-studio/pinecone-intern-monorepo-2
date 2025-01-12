import * as preCommit from '../../src/pre-commit/pre-commit-script';
import { red } from 'chalk';
import { performPreCommitChecks } from '../../src/pre-commit/pre-commit-checks';
import * as validateBranch from '../../src/pre-commit/validate-branch';

jest.mock('../../src/pre-commit/validate-branch', () => ({
  validateCurrentBranch: jest.fn(),
}));

jest.mock('../../src/pre-commit/pre-commit-checks', () => ({
  performPreCommitChecks: jest.fn(),
}));

describe('handleError', () => {
  let consoleLogSpy;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('1. Should log the error message in red and exit with code 1', () => {
    const errorMessage = 'Test error message';
    const expectedLogMessage = `\n > Error during pre-commit checks: ${errorMessage} \n`;

    try {
      preCommit.handleError(new Error(errorMessage));
    } catch (error) {
      expect(consoleLogSpy).toHaveBeenCalledWith(red(expectedLogMessage));
    }
  });

  it('2. Should handle non-Error input and log it', () => {
    const customErrorMessage = 'Custom error message';
    const expectedLogMessage = `\n > Error during pre-commit checks: ${customErrorMessage} \n`;

    try {
      preCommit.handleError(customErrorMessage);
    } catch (error) {
      expect(consoleLogSpy).toHaveBeenCalledWith(red(expectedLogMessage));
    }
  });
});

describe('runPreCommitScript', () => {
  let handleErrorMock;

  beforeEach(() => {
    handleErrorMock = jest.spyOn(preCommit, 'handleError');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('1. Should run pre-commit script successfully', () => {
    preCommit.runPreCommitScript();

    expect(validateBranch.validateCurrentBranch).toHaveBeenCalled();
    expect(performPreCommitChecks).toHaveBeenCalled();
    expect(handleErrorMock).not.toHaveBeenCalled();
  });

  it('2. Should handle error if any of the steps fail', () => {
    const error = new Error('Test error');
    const validateCurrentBranchSpy = jest.spyOn(validateBranch, 'validateCurrentBranch');
    validateCurrentBranchSpy.mockImplementation(() => {
      throw error;
    });

    preCommit.runPreCommitScript();

    expect(handleErrorMock).toHaveBeenCalledWith(error);
    expect(performPreCommitChecks).not.toHaveBeenCalled();
  });
});
