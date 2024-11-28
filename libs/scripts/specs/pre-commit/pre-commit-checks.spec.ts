import { blue, green } from 'chalk';
import { spawnSync } from 'child_process';
import * as preCommitChecks from '../../src/pre-commit/pre-commit-checks';
import * as getAffectedApps from '../../src/utils/affected/get-affected-apps';

jest.mock('child_process');

describe('runCommandOnAffectedProject', () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    jest.resetAllMocks();
  });

  it('1. Should run the command successfully and log the success message', () => {
    const projectName = 'test-project';
    const command = 'build';

    (spawnSync as jest.Mock).mockReturnValue({ status: 0 });

    preCommitChecks.runCommandOnAffectedProject(projectName, command);

    expect(consoleLogSpy).toHaveBeenCalledWith(blue(`\n > Running ${command} for ${projectName} ... \n`));
    expect(consoleLogSpy).toHaveBeenCalledWith(green(`\n > Successfully ${command} the project ${projectName} \n`));
    expect(spawnSync).toHaveBeenCalledWith('npx', ['nx', command, projectName], { stdio: 'inherit' });
  });

  it('2. Should throw an error if the command fails', () => {
    const projectName = 'test-project';
    const command = 'build';
    const errorMessage = `${command} failed on ${projectName}. Check the console for more information.`;

    (spawnSync as jest.Mock).mockReturnValue({ status: 1 });

    expect(() => preCommitChecks.runCommandOnAffectedProject(projectName, command)).toThrow(errorMessage);

    expect(consoleLogSpy).toHaveBeenCalledWith(blue(`\n > Running ${command} for ${projectName} ... \n`));
    expect(consoleLogSpy).not.toHaveBeenCalledWith(green(`\n > Successfully ${command} the project ${projectName} \n`));
    expect(spawnSync).toHaveBeenCalledWith('npx', ['nx', command, projectName], { stdio: 'inherit' });
  });
});

describe('runChecksOnAffectedApps', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should run checks on affected apps for lint, build, and test actions', () => {
    const runCommandMock = jest.spyOn(preCommitChecks, 'runCommandOnAffectedProject');
    const getAffectedAppsMock = jest.spyOn(getAffectedApps, 'getAffectedApps');
    getAffectedAppsMock.mockReturnValue(['app1', 'app2']);

    runCommandMock.mockImplementation();

    preCommitChecks.runChecksOnAffectedApps('lint', 'lint');

    expect(runCommandMock).toHaveBeenCalled();
  });
});

describe('performPreCommitChecks', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should run checks on affected apps for lint, build, and test actions', () => {
    const runCommandMock = jest.spyOn(preCommitChecks, 'runChecksOnAffectedApps');
    runCommandMock.mockImplementation();
    preCommitChecks.performPreCommitChecks();

    expect(runCommandMock).toHaveBeenCalledTimes(2);
    expect(runCommandMock).toHaveBeenCalledWith('lint', 'lint');
    expect(runCommandMock).toHaveBeenCalledWith('build', 'build');
  });
});
