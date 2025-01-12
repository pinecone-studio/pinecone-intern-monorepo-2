import * as fs from 'fs';
import * as cleanEnvFiles from '../../../src/utils/actions/clean-generated-preview-env-files';

jest.mock('fs');
jest.mock('../../../src/utils/affected/get-affected-federation-services', () => ({
  getAffectedFederationServices: jest.fn().mockReturnValue(['app1']),
}));

describe('cleanGeneratedPreviewEnvFiles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should remove .env.preview files from specified paths if they exist', () => {
    const mockExistsSync = jest.spyOn(fs, 'existsSync');
    const mockUnlinkSync = jest.spyOn(fs, 'unlinkSync');

    mockExistsSync.mockReturnValueOnce(true);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mockUnlinkSync.mockImplementationOnce(() => {});

    cleanEnvFiles.cleanGeneratedPreviewEnvFiles();
  });

  it('should log a message if .env.preview file is not found in specified paths', () => {
    const mockExistsSync = jest.spyOn(fs, 'existsSync');
    const mockUnlinkSync = jest.spyOn(fs, 'unlinkSync');

    mockExistsSync.mockReturnValueOnce(false);

    cleanEnvFiles.cleanGeneratedPreviewEnvFiles();

    expect(mockUnlinkSync).not.toHaveBeenCalled();
  });
});

describe('shouldAddFederationToAffected', () => {
  it('Should return affectedServices when it includes federation', () => {
    const affected = ['app1', 'federation'];

    const result = cleanEnvFiles.shouldAddFederationToAffected(affected);

    expect(result).toStrictEqual(affected);
  });

  it('Should add federation', () => {
    const affected = ['assessment-service'];

    const result = cleanEnvFiles.shouldAddFederationToAffected(affected);

    expect(result).toContainEqual('federation');
  });
});
