/* eslint-disable max-lines */
import { execSync } from 'child_process';
import * as affectedApps from '../../../src/utils/affected/get-affected-apps';

jest.mock('child_process');

describe('generateTaggedOption', () => {
  it('1. Should generate a tagged option when tag is true', () => {
    const result = affectedApps.generateTaggedOption(true, 'value', 'type');
    expect(result).toBe('--type=value');
  });

  it('2. Should return the original value when tag is false', () => {
    const result = affectedApps.generateTaggedOption(false, 'value', 'type');
    expect(result).toBe('value');
  });
});

describe('execAndTrim', () => {
  it('1. Should execute a command and return the trimmed output', () => {
    const command = 'some command';
    const mockReturnValue = '  test  \n';
    const mockFunction = jest.fn(() => Buffer.from(mockReturnValue, 'utf-8'));
    const execSyncMock = execSync as jest.Mock;
    execSyncMock.mockImplementation(mockFunction);

    const result = affectedApps.execAndTrim(command);

    expect(execSyncMock).toHaveBeenCalledWith(command);
    expect(result).toBe('test');
  });
});

describe('without NX HEAD and BASE', () => {
  const originalEnv = { ...process.env };
  
  beforeAll(() => {
    // Clear base and head environment variables
    delete process.env.base;
    delete process.env.head;
  });
  
  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });
  it('1. Should return changed files', () => {
    const mockReturnValue = '  M file1.txt\nA file2.txt\nD file3.txt  \n';
    const mockFunction = jest.fn(() => Buffer.from(mockReturnValue, 'utf-8'));
    const execSyncMock = execSync as jest.Mock;
    execSyncMock.mockImplementation(mockFunction);

    const gitDiffStatus = affectedApps.getChangedFiles();

    expect(execSyncMock).toHaveBeenCalledWith('git diff --cached --name-status');
    expect(gitDiffStatus).toBe('M file1.txt\nA file2.txt\nD file3.txt');
  });
  it('2. Should return changed projects', () => {
    const mockReturnValue = 'test\n';
    const mockFunction = jest.fn(() => Buffer.from(mockReturnValue, 'utf-8'));
    const execSyncMock = execSync as jest.Mock;
    execSyncMock.mockImplementation(mockFunction);

    const affectedProjectsList = affectedApps.getAffectedProjectsList();

    expect(execSyncMock).toHaveBeenCalledWith('npx nx show projects --affected ');
    expect(affectedProjectsList).toEqual(['test']);
  });
});

describe('getNxHeadAndBase', () => {
  const mockEnv = {
    base: 'baseValue',
    head: 'headValue',
  };

  beforeAll(() => {
    process.env = { ...process.env, ...mockEnv };
  });

  afterAll(() => {
    process.env = { ...process.env };
    jest.clearAllMocks();
  });
  it('1. Should return the correct nxBase and nxHead values when tag is true', () => {
    const result = affectedApps.getNxHeadAndBase({ tag: true });
    expect(result).toEqual({
      nxBase: '--base=baseValue',
      nxHead: '--head=headValue',
    });
  });

  it('2. Should return the correct nxBase and nxHead values when tag is false', () => {
    const result = affectedApps.getNxHeadAndBase({ tag: false });
    expect(result).toEqual({ nxBase: 'baseValue', nxHead: 'headValue' });
  });

  it('3. Should return changed files', () => {
    const mockReturnValue = '  M file1.txt\nA file2.txt\nD file3.txt  \n';
    const mockFunction = jest.fn(() => Buffer.from(mockReturnValue, 'utf-8'));
    const execSyncMock = execSync as jest.Mock;
    execSyncMock.mockImplementation(mockFunction);

    const gitDiffStatus = affectedApps.getChangedFiles();

    expect(execSyncMock).toHaveBeenCalledWith(`git diff --name-status ${mockEnv.base}...${mockEnv.head}`);
    expect(gitDiffStatus).toBe('M file1.txt\nA file2.txt\nD file3.txt');
  });
  it('4. Should return changed projects', () => {
    const mockReturnValue = '{"key": "value"}';
    const mockFunction = jest.fn(() => Buffer.from(mockReturnValue, 'utf-8'));
    const execSyncMock = execSync as jest.Mock;
    execSyncMock.mockImplementation(mockFunction);

    const affectedProjectsList = affectedApps.getAffectedProjectsList();
    expect(affectedProjectsList).toEqual(['{"key": "value"}']);
  });
});

describe('findMatchingDirectory', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });
  it('1. Should find a matching directory in the list', () => {
    const logLine = 'M path/to/directory/file.txt';
    const directories = ['directory', 'other_directory'];

    const getProjectPathMock = jest.spyOn(affectedApps, 'getProjectPath');
    getProjectPathMock.mockReturnValueOnce('path/to/directory');

    const result = affectedApps.findMatchingDirectory(logLine, directories);

    expect(result).toBe('directory');
  });
});

describe('getProjectPath', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('1. Should return the root path of the affected project were one', () => {
    const execAndTrimMock = jest.spyOn(affectedApps, 'execAndTrim');
    execAndTrimMock.mockReturnValueOnce('{"root": "/path/to/project"}');

    const result = affectedApps.getProjectPath('sampleProject');

    expect(execAndTrimMock).toHaveBeenCalledWith('npx nx show project sampleProject');
    expect(result).toBe('/path/to/project');
  });

  it('2. Should return the root path of the affected projects were two or more', () => {
    const execAndTrimMock = jest.spyOn(affectedApps, 'execAndTrim');
    execAndTrimMock.mockReturnValueOnce('{"root": "/path/to/project"}');

    const firstResult = affectedApps.getProjectPath('sampleProject');
    const secondResult = affectedApps.getProjectPath('sampleProject');

    expect(execAndTrimMock).toHaveBeenCalledWith('npx nx show project sampleProject');
    expect(firstResult).toBe('/path/to/project');
    expect(secondResult).toBe('/path/to/project');
  });
});

describe('checkMatchingRoot', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });
  it('1. Should return the matching directory if found in the filePath', () => {
    const directories = ['project1', 'project2'];
    const filePath = '/path/to/project1/file.txt';

    const getProjectPathMock = jest.spyOn(affectedApps, 'getProjectPath');
    getProjectPathMock.mockReturnValueOnce('/path/to/project1');

    const result = affectedApps.checkMatchingRoot(directories, filePath);
    expect(result).toBe('project1');
  });

  it('2. Should return the matching directory based on getProjectPath if not found in the filePath', () => {
    const directories = ['project1', 'project2'];
    const filePath = '/path/to/file.txt';

    const getProjectPathMock = jest.spyOn(affectedApps, 'getProjectPath');
    getProjectPathMock.mockReturnValueOnce('/path/to/project2');

    affectedApps.checkMatchingRoot(directories, filePath);

    expect(getProjectPathMock).toHaveBeenCalledWith('project1');
    expect(getProjectPathMock).toHaveBeenCalledWith('project2');
  });
});

describe('processChangedFiles', () => {
  it('1. Should process and return matching directories from a list of changed files', () => {
    const files = 'M path/to/directory1/file.txt\nA path/to/directory2/file.txt\nD path/to/directory1/other.txt';
    const directories = ['directory1', 'directory2', 'directory3'];

    const getProjectPathMock = jest.spyOn(affectedApps, 'findMatchingDirectory');
    getProjectPathMock.mockReturnValueOnce('directory1');

    const result = affectedApps.processChangedFiles(files, directories);

    expect(result).toEqual(['directory1']);
  });
});

describe('getAffectedApps', () => {
  jest.mock('../../../src/utils/affected/get-affected-apps', () => ({
    getAffectedProjectsList: jest.fn(),
    getGitDiffStatus: jest.fn(),
    processChangedFiles: jest.fn(),
  }));
  it('1. Should call the required functions and return the result', () => {
    const mockAffectedProjectsList = ['app1', 'app2'];
    const mockGitDiffStatus = 'M app1/file1.txt\nA app2/file2.txt';
    const mockProcessedFiles = ['app1', 'app2'];

    const affectedProjectsListMock = jest.spyOn(affectedApps, 'getAffectedProjectsList');
    affectedProjectsListMock.mockReturnValue(mockAffectedProjectsList);

    const gitDiffStatusMock = jest.spyOn(affectedApps, 'getChangedFiles');
    gitDiffStatusMock.mockReturnValue(mockGitDiffStatus);

    const processChangedFilesMock = jest.spyOn(affectedApps, 'processChangedFiles');
    processChangedFilesMock.mockReturnValue(mockProcessedFiles);

    const result = affectedApps.getAffectedApps();

    expect(affectedProjectsListMock).toHaveBeenCalled();
    expect(gitDiffStatusMock).toHaveBeenCalled();
    expect(processChangedFilesMock).toHaveBeenCalledWith(mockGitDiffStatus, mockAffectedProjectsList);
    expect(result).toEqual(mockProcessedFiles);
  });
});
