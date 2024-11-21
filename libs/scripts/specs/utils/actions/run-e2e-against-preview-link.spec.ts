/* eslint-disable max-lines */
/* eslint-disable no-secrets/no-secrets */
import { execSync, spawn } from 'child_process';
import * as runE2eAgainstPreviewLink from '../../../src/utils/actions/run-e2e-against-preview-link';

jest.mock('child_process');

describe('getProjectInfo', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should return project info when command succeeds', () => {
    const mockProject = {
      name: 'example-project',
      url: 'An example project',
    };
    const mockProjectInfo = JSON.stringify(mockProject);
    const mockProjectName = 'example-project';
    const mockCommand = `npx nx show project ${mockProjectName}`;

    const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

    mockExecSync.mockReturnValueOnce(Buffer.from(mockProjectInfo));

    const result = runE2eAgainstPreviewLink.getProjectInfo(mockProjectName);

    expect(execSync).toHaveBeenCalledWith(mockCommand);
    expect(result).toEqual(mockProject);
  });
});

describe('doesProjectHaveE2ECommand', () => {
  it('Should return e2e command available project', () => {
    const mockProjectInfo = {
      targets: {
        e2e: {
          executor: '@nrwl/cypress:cypress',
        },
      },
    };
    const mockGetProjectInfo = jest.spyOn(runE2eAgainstPreviewLink, 'getProjectInfo');
    mockGetProjectInfo.mockReturnValueOnce(mockProjectInfo);

    const result = runE2eAgainstPreviewLink.doesProjectHaveE2ECommand('test');
    expect(result).toEqual(mockProjectInfo.targets['e2e']);
  });
});

describe('isCommandFailed', () => {
  it('should throw error for non-zero exit code', () => {
    const errorCode = 1;
    const errorMessage = `Command failed with exit code ${errorCode}`;

    expect(() => runE2eAgainstPreviewLink.isCommandFailed(errorCode)).toThrowError(errorMessage);
  });

  it('should return true for zero exit code', () => {
    const exitCode = 0;

    const result = runE2eAgainstPreviewLink.isCommandFailed(exitCode);

    expect(result).toBe(true);
  });
});

const generateMockImplementation = () => {
  return {
    on: jest.fn((event, callback) => {
      if (event === 'data') {
        return callback('hello');
      }
    }),
  };
};

const generateOnMockImplementation = (event, callback) => {
  if (event === 'close') {
    callback(1);
  }
};

describe('runE2ECommand', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should run e2e command and resolve when projectWithE2E is defined', async () => {
    const mockProjectWithE2E = 'example-project';
    const mockProject = {
      name: 'example-project',
      url: 'http://example.com',
    };
    const mockIsCommandFailed = jest.spyOn(runE2eAgainstPreviewLink, 'isCommandFailed');
    mockIsCommandFailed.mockImplementation();

    const spawnMock = spawn as jest.Mock;
    spawnMock.mockImplementation(() => ({
      stdout: generateMockImplementation(),
      stderr: generateMockImplementation(),
      on: jest.fn(generateOnMockImplementation),
      stdio: [],
      killed: false,
      connected: true,
    }));

    await runE2eAgainstPreviewLink.runE2ECommand(mockProjectWithE2E, mockProject);

    expect(spawn).toHaveBeenCalled();
    expect(mockIsCommandFailed).toHaveBeenCalled();
  });

  it('should not run e2e command when projectWithE2E is undefined', async () => {
    const mockProject = {
      name: 'example-project',
      url: 'http://example.com',
    };

    await runE2eAgainstPreviewLink.runE2ECommand(undefined, mockProject);

    expect(spawn).not.toHaveBeenCalled();
  });
});

describe('runE2EActionAgainstPreviewLink', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should run e2e command and resolve when projectWithE2E is defined', async () => {
    const mockProject = {
      name: 'example-project',
      url: 'http://example.com',
    };
    const expectedError = new Error('Previous error');

    const mockDoesProjectHaveE2ECommand = jest.spyOn(runE2eAgainstPreviewLink, 'doesProjectHaveE2ECommand');
    mockDoesProjectHaveE2ECommand.mockImplementation(() => {
      return {};
    });

    const mockIsCommandFailed = jest.spyOn(runE2eAgainstPreviewLink, 'isCommandFailed');
    mockIsCommandFailed.mockImplementation(() => {
      throw expectedError;
    });
    const exitProcessSpy = jest.spyOn(process, 'exit').mockImplementation();

    const spawnMock = spawn as jest.Mock;
    spawnMock.mockImplementation(() => ({
      stdout: generateMockImplementation(),
      stderr: generateMockImplementation(),
      on: jest.fn(generateOnMockImplementation),
      stdio: [],
      killed: false,
      connected: true,
    }));

    try {
      await runE2eAgainstPreviewLink.runE2EActionAgainstPreviewLink([mockProject]);
      expect(true).toBe(false);
    } catch (error) {
      expect(exitProcessSpy).toHaveBeenCalled();
    }

    expect(spawn).toHaveBeenCalled();
    expect(mockIsCommandFailed).toHaveBeenCalled();
  });
});
