import { green, red } from 'chalk';
import { execSync, spawn } from 'child_process';
import { executeCypressTest } from '../../src/commands/execute-cypress';

jest.mock('../../src/actions/e2e/check-cypress-code-coverage', () => ({
  checkCypressCodeCoverage: jest.fn(),
}));

jest.mock('chalk', () => ({
  green: jest.fn((text) => `green: ${text}`),
  red: jest.fn((text) => `red: ${text}`),
}));

jest.mock('child_process', () => ({
  execSync: jest.fn(() => JSON.stringify({ root: '' })),
  spawn: jest.fn(() => ({
    stdout: {
      on: (event, cb) => {
        if (event === 'data') {
          cb('');
        }
      },
    },
    stderr: {
      on: (event, cb) => {
        if (event === 'data') {
          cb('mock error');
        }
      },
    },
    on: jest.fn((_event, cb) => {
      cb('close');
    }),
  })),
}));

process.exit = jest.fn() as unknown as (_code?: number) => never;

describe('executeCypressTest function', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {
      console.log('scripts');
    });
  });

  it('should execute cypress test and handle child process events', async () => {
    const app = 'yourApp';
    const mockRoot = '/path/to/root';
    const mockStdoutData = 'mock stdout data';

    process.argv = ['node', 'script', app];

    (execSync as jest.Mock).mockReturnValueOnce(JSON.stringify({ root: mockRoot }));

    const onSpy = jest.fn((event, cb) => {
      if (event === 'data') {
        cb(mockStdoutData);
      }
    });

    (spawn as jest.Mock).mockReturnValueOnce({
      stdout: { on: onSpy },
      stderr: { on: onSpy },
      on: jest.fn((_event, cb) => {
        cb('close');
      }),
    });

    await executeCypressTest();

    expect(execSync).toHaveBeenCalledWith(`npx nx show project ${app}`);
    expect(spawn).toHaveBeenCalledWith(`npx nx cypress ${process.argv.slice(2).join(' ')} --parallel`, [], { shell: true });
    expect(onSpy).toHaveBeenCalledWith('data', expect.any(Function));
    expect(red).toHaveBeenCalledWith('closed');
    expect(green).toHaveBeenCalledWith('Success mochawesome-merge');
    expect(green).toHaveBeenCalledWith('Success marge');
    expect(green).toHaveBeenCalledWith('Success check-cypress-code-coverage scripts');
  });
});
