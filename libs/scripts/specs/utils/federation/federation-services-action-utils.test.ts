/* eslint-disable max-lines */
import fs from 'fs';
import * as federationServicesAction from '../../../src/utils/federation/federation-services-action-utils';

jest.mock('fs');

describe('deleteExistingPreviewFile', () => {
  it('1. Should delete the file if it exists', () => {
    const filePath = '/path/to/existing/file.txt';
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);

    federationServicesAction.deleteExistingPreviewFile(filePath);
    expect(fs.existsSync).toHaveBeenCalledWith(filePath);
    expect(fs.unlinkSync).toHaveBeenCalledWith(filePath);
  });
});

describe('updatePreviewFile', () => {
  it('1. Should append the correct content to the file', () => {
    const envPath = '/path/to/env/file.env';
    const key = 'REACT_APP_GRAPHQL_ENDPOINT';
    const link = 'https://example.com';

    jest.spyOn(fs, 'appendFileSync').mockImplementation((path, content) => {
      expect(path).toBe(envPath);
      expect(content).toBe(`${key}=${link}/api/graphql`);
    });

    federationServicesAction.updatePreviewFile(envPath, key, link);
    expect(fs.appendFileSync).toHaveBeenCalled();
  });
});

describe('writePreviewFile', () => {
  it('1. Should append the correct content to the file', () => {
    const envPath = '/path/to/env/file.env';
    const content = 'KEY=value';

    jest.spyOn(fs, 'appendFileSync').mockImplementation((path, appendedContent) => {
      expect(path).toBe(envPath);
      expect(appendedContent).toBe(`${content}\n`);
    });

    federationServicesAction.writePreviewFile(envPath, content);
    expect(fs.appendFileSync).toHaveBeenCalled();
  });
});

describe('handleAffectedService', () => {
  jest.mock('../../../src/utils/federation/federation-services-action-utils', () => ({
    updatePreviewFile: jest.fn(),
  }));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('1. Should call updatePreviewFile with correct parameters when service name matches', () => {
    const service = { name: 'updated-line', url: 'https' };
    const updatedLine = 'UPDATED_LINE';
    const originalLine = 'KEY=VALUE';
    const envPath = '/path/to/env/file.env';
    const replaced = false;

    const mockUpdatePreviewFile = jest.spyOn(federationServicesAction, 'updatePreviewFile');
    mockUpdatePreviewFile.mockReturnValueOnce();

    const result = federationServicesAction.handleAffectedService(service, updatedLine, originalLine, envPath, replaced);

    expect(result).toBe(true);
    expect(mockUpdatePreviewFile).toHaveBeenCalledWith(envPath, 'KEY', service.url);
  });

  it('2. Should return false when service name does not match', () => {
    const service = { name: 'other_project', url: 'https' };
    const updatedLine = 'UPDATED_LINE';
    const originalLine = 'KEY=VALUE';
    const envPath = '/path/to/env';
    const replaced = false;

    const result = federationServicesAction.handleAffectedService(service, updatedLine, originalLine, envPath, replaced);

    expect(result).toBe(replaced);
  });
});

const mockAffectedServices = [
  { name: 'service1', url: 'https1' },
  { name: 'service2', url: 'https2' },
];

describe('processEnvTestingLine', () => {
  jest.mock('../../../src/utils/federation/federation-services-action-utils', () => ({
    handleAffectedService: jest.fn(),
  }));

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('1. Should call handleAffectedService and writePreviewFile with correct parameters for each affected service', () => {
    const line = 'KEY=VALUE';

    const envPath = '/path/to/env/file.env';

    const mockHandleAffectedService = jest.spyOn(federationServicesAction, 'handleAffectedService');
    mockHandleAffectedService.mockImplementationOnce((service, updatedLine, originalLine, path, replaced) => {
      return replaced || service.name === 'service1';
    });
    const mockWritePreviewFile = jest.spyOn(federationServicesAction, 'writePreviewFile');
    mockWritePreviewFile.mockReturnValueOnce();

    federationServicesAction.processEnvTestingLine(line, mockAffectedServices, envPath);

    expect(mockHandleAffectedService).toHaveBeenCalledWith(mockAffectedServices[0], 'KEY', line, envPath, false);
    expect(mockHandleAffectedService).toHaveBeenCalledWith(mockAffectedServices[1], 'KEY', line, envPath, true);
    expect(mockWritePreviewFile).toHaveBeenCalledWith(envPath, '');
  });

  it('2. Should call handleAffectedService and writePreviewFile with correct parameters for each affected service', () => {
    const line = 'KEY=VALUE';

    const envPath = '/path/to/env/file.env';

    const mockHandleAffectedService = jest.spyOn(federationServicesAction, 'handleAffectedService');
    mockHandleAffectedService.mockImplementationOnce((service, updatedLine, originalLine, path, replaced) => {
      return replaced;
    });
    const mockWritePreviewFile = jest.spyOn(federationServicesAction, 'writePreviewFile');
    mockWritePreviewFile.mockReturnValueOnce();

    federationServicesAction.processEnvTestingLine(line, mockAffectedServices, envPath);
    expect(mockWritePreviewFile).toHaveBeenCalledWith(envPath, 'KEY=VALUE');
  });
});

describe('generatePreviewEnv', () => {
  jest.mock('../../../src/utils/federation/federation-services-action-utils', () => ({
    deleteExistingPreviewFile: jest.fn(),
    processEnvTestingLine: jest.fn(),
  }));

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('1. Should generate preview env', () => {
    const envPreviewPath = 'apps/federation/.env.preview';

    const mockDeleteExistingPreviewFile = jest.spyOn(federationServicesAction, 'deleteExistingPreviewFile');
    mockDeleteExistingPreviewFile.mockReturnValueOnce();
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('line1\nline2\nline3');
    jest.spyOn(fs, 'appendFileSync').mockImplementation(() => {
      return envPreviewPath;
    });

    federationServicesAction.generatePreviewEnv(mockAffectedServices);
    expect(mockDeleteExistingPreviewFile).toHaveBeenCalledWith(envPreviewPath);
  });
});
