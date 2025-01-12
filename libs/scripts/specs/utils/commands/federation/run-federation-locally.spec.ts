import {
  ChildProcess,
  ChildProcessWithoutNullStreams,
  spawn,
} from 'child_process';
import { runFederationLocally } from '../../../../src/utils';

jest.mock('child_process', () => ({
  spawn: jest.fn(() => {
    const stdoutEmitter = {
      on: jest.fn(),
    };
    const stderrEmitter = {
      on: jest.fn(),
    };
    const processEmitter = {
      on: jest.fn(),
    };
    return {
      stdout: stdoutEmitter,
      stderr: stderrEmitter,
      on: processEmitter.on,
    } as unknown as ChildProcessWithoutNullStreams;
  }),
}));

describe('executeFederation', () => {
  let mockStdoutOn: jest.Mock;
  let mockStderrOn: jest.Mock;
  let mockOn: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockStdoutOn = jest.fn();
    mockStderrOn = jest.fn();
    mockOn = jest.fn();

    const mockSpawnSync = spawn as jest.MockedFunction<typeof spawn>;
    mockSpawnSync.mockReturnValue({
      stdout: { on: mockStdoutOn },
      stderr: { on: mockStderrOn },
      on: mockOn,
    } as unknown as ChildProcess);
  });

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('1. Should execute federation server', () => {
    runFederationLocally();
    expect(spawn).toHaveBeenCalledWith(
      'npx env-cmd -f apps/federation/.env.local nx serve federation --configuration=local',
      [],
      { shell: true }
    );
  });

  it('2. Should log server output when data is received on stdout', () => {
    runFederationLocally();

    const mockData = Buffer.from('Listening at http://localhost:3333/graphql');
    mockStdoutOn.mock.calls[0][1](mockData);

    expect(mockStdoutOn).toHaveBeenCalledWith('data', expect.any(Function));
  });

  it('3. Should log server error when data is received on stderr', () => {
    runFederationLocally();

    const errorMessage = 'Error message';
    const mockData = Buffer.from(errorMessage);
    mockStderrOn.mock.calls[0][1](mockData);

    expect(mockStderrOn).toHaveBeenCalledWith('data', expect.any(Function));
    expect(console.error).toHaveBeenCalledWith(`Server error: ${errorMessage}`);
  });

  it('4. Should log server exit code when the process is closed', () => {
    runFederationLocally();

    const exitCode = 0;

    expect(mockOn).toHaveBeenCalledWith('close', expect.any(Function));
    const closeEventListener = mockOn.mock.calls.find(
      (args) => args[0] === 'close'
    )[1];

    closeEventListener(exitCode);
    expect(console.error).toHaveBeenCalledWith(
      `Server exited with code ${exitCode}`
    );
  });
});
