import { execSync } from 'child_process';
import * as validateBranch from '../../src/pre-commit/validate-branch';

jest.mock('child_process');

describe('pre-commit-script', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  describe('getGitBranchName', () => {
    it('1. Should return the current Git branch name', () => {
      const mockReturnValue = 'test';
      const execSyncMockFunction = () => Buffer.from(mockReturnValue, 'utf-8');
      const mockFunction = jest.fn(execSyncMockFunction);
      const execSyncMock = execSync as jest.Mock;
      execSyncMock.mockImplementation(mockFunction);

      try {
        const branchName = validateBranch.getGitBranchName();
        expect(branchName).toBe(mockReturnValue);
      } catch (error) {
        console.log(error);
      } finally {
        execSyncMock.mockRestore();
      }
    });

    it('2. Should throw an error if unable to retrieve Git branch name', () => {
      const execSyncMockFunction = () => {
        throw new Error('mock error');
      };
      const errorMessage = 'Unable to retrieve Git branch name. Please ensure that you are in a Git repository.';
      const mockFunction = jest.fn(execSyncMockFunction);
      const execSyncMock = execSync as jest.Mock;
      execSyncMock.mockImplementation(mockFunction);

      try {
        expect(() => validateBranch.getGitBranchName()).toThrow(errorMessage);
      } catch (error) {
        console.log(error);
      } finally {
        execSyncMock.mockRestore();
      }
    });
  });

  describe('check branch functions', () => {
    let consoleErrorSpy: jest.SpyInstance;

    const mainBranchErrorMessage = "You can't commit directly to the main branch. Create a feature branch and try again.";
    const branchFormatErrorMessage = 'Your branch must be created from an issue. e.g. 12-branch-name';

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it("1.Should log an error message and exit for the 'main' branch", () => {
      expect(() => validateBranch.checkMainBranch('main')).toThrow(mainBranchErrorMessage);
    });

    it('2. Should do nothing for a branch other than the main branch', () => {
      validateBranch.checkMainBranch('feature-branch');
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
    it('3. Should not log or exit for a valid branch format', () => {
      validateBranch.checkValidBranchFormat('123-branch-name');
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('4. Should log and exit for an invalid branch format', () => {
      expect(() => validateBranch.checkValidBranchFormat('invalid-branch-name')).toThrow(branchFormatErrorMessage);
    });
  });
});

describe('validateCurrentBranch', () => {
  let processExitSpy: jest.SpyInstance;
  let getGitBranchNameMock: jest.SpyInstance;
  let checkValidBranchFormatMock: jest.SpyInstance;

  beforeEach(() => {
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation();
    getGitBranchNameMock = jest.spyOn(validateBranch, 'getGitBranchName').mockReturnValue('test');
    checkValidBranchFormatMock = jest.spyOn(validateBranch, 'checkValidBranchFormat').mockReturnValue();
  });

  afterEach(() => {
    processExitSpy.mockRestore();
    getGitBranchNameMock.mockRestore();
    jest.clearAllMocks();
  });

  it('1. Should call the required functions', () => {
    const getGitBranchNameMock = jest.spyOn(validateBranch, 'getGitBranchName').mockReturnValue('test');

    validateBranch.validateCurrentBranch();

    expect(getGitBranchNameMock).toHaveBeenCalled();
    expect(checkValidBranchFormatMock).toHaveBeenCalled();
  });
});
