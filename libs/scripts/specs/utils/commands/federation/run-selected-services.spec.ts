import { ChildProcess, spawn } from 'child_process';
import fs from 'fs';
import { runSelectedServices } from '../../../../src/utils';

jest.mock('fs', () => {
  const mockReadFileSync = jest.fn();

  return {
    readFileSync: mockReadFileSync,
    writeFileSync: jest.fn(),
  };
});

jest.mock('child_process', () => ({
  spawn: jest.fn(() => ({
    stdout: { on: jest.fn() },
    stderr: { on: jest.fn() },
    on: jest.fn(),
  })),
}));

describe('executeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('1. Should execute service successfully', async () => {
    const serviceName = 'example-service';
    const localhostURL = 'http://localhost:3000';
    const mockStdoutOn = jest.fn();

    const mockReadFileSync = fs.readFileSync as jest.MockedFunction<
      typeof fs.readFileSync
    >;
    mockReadFileSync.mockReturnValue('');

    const mockSpawn = spawn as jest.MockedFunction<typeof spawn>;
    mockSpawn.mockReturnValue({
      stdout: { on: mockStdoutOn },
      stderr: { on: jest.fn() },
      on: jest.fn(),
    } as unknown as ChildProcess);

    mockStdoutOn.mockImplementationOnce((event, callback) => {
      const data = `url: ${localhostURL}`;
      callback(data);
    });

    await runSelectedServices(serviceName);
  });

  it('2. Should handle server error', async () => {
    const serviceName = 'example-service';
    const mockStderrOn = jest.fn();
    const error = new Error('Server error');

    const mockSpawn = spawn as jest.MockedFunction<typeof spawn>;
    mockSpawn.mockReturnValue({
      stdout: { on: jest.fn() },
      stderr: { on: mockStderrOn },
      on: jest.fn(),
    } as unknown as ChildProcess);

    mockStderrOn.mockImplementationOnce((event, callback) => {
      callback(error);
    });

    await expect(runSelectedServices(serviceName)).rejects.toThrow(
      `Server error for service ${serviceName}`
    );
  });

  it('3. Should handle server closing event', async () => {
    const serviceName = 'example-service';
    const mockOn = jest.fn();
    const exitCode = 1;

    const mockSpawn = spawn as jest.MockedFunction<typeof spawn>;
    mockSpawn.mockReturnValue({
      stdout: { on: jest.fn() },
      stderr: { on: jest.fn() },
      on: mockOn,
    } as unknown as ChildProcess);

    mockOn.mockImplementationOnce((event, callback) => {
      callback(exitCode);
    });

    await expect(runSelectedServices(serviceName)).rejects.toThrow(
      `Server exited with code ${exitCode} for service ${serviceName}`
    );
  });
});
