import { exec } from 'child_process';
import { copyDevToLocalEnv } from '../../../../src/utils';

jest.mock('child_process', () => ({
  exec: jest.fn(),
}));

describe('copyFile function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('1. Should copy file successfully', () => {
    const sourcePath = '/path/to/source';
    const destinationPath = '/path/to/destination';

    copyDevToLocalEnv(sourcePath, destinationPath);

    const expectedCommand = `cp ${sourcePath} ${destinationPath}`;
    expect(exec).toHaveBeenCalledWith(expectedCommand);
  });
});
