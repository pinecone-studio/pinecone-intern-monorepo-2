/* eslint-disable no-secrets/no-secrets */
import * as federationUtils from '../../../src/utils/affected/get-affected-federation-services';
import fs from 'fs';

describe('parseMicroserviceName', () => {
  it('1. Should parse microservice name correctly from a valid input', () => {
    const line = 'MICROSERVICE_NAME=value';
    const result = federationUtils.parseMicroserviceName(line);
    expect(result).toBe('microservice-name');
  });
  it('2. Should return an empty string for invalid input', () => {
    const line = 'invalid_line';
    const result = federationUtils.parseMicroserviceName(line);
    expect(result).toBe('');
  });
});

describe('checkFileExistence', () => {
  it('1. Should not throw an error for an existing file', () => {
    const tempFilePath = 'tempFile.txt';
    fs.writeFileSync(tempFilePath, 'Test content');

    expect(() => federationUtils.checkFileExistence(tempFilePath)).not.toThrow();
    fs.unlinkSync(tempFilePath);
  });

  it('2. Should throw an error for a non-existing file', () => {
    const nonExistentFilePath = 'nonExistentFile.txt';
    expect(() => federationUtils.checkFileExistence(nonExistentFilePath)).toThrowError(`Could not find any file on this path: ${nonExistentFilePath}`);
  });
});

describe('readFileIfExists', () => {
  it('1. Should read the content of an existing file', () => {
    const tempFilePath = 'tempFile.txt';
    const fileContent = 'Test content';
    fs.writeFileSync(tempFilePath, fileContent);

    const result = federationUtils.readFileIfExists(tempFilePath);
    expect(result).toBe(fileContent);
    fs.unlinkSync(tempFilePath);
  });

  it('2. Should throw an error for a non-existing file', () => {
    const nonExistentFilePath = 'nonExistentFile.txt';
    expect(() => federationUtils.readFileIfExists(nonExistentFilePath)).toThrowError(`Could not find any file on this path: ${nonExistentFilePath}`);
  });
});

describe('getFederationServices', () => {
  jest.mock('../../../src/utils/affected/get-affected-federation-services.ts', () => ({
    readFileIfExists: jest.fn(),
    parseMicroserviceName: jest.fn(),
  }));
  it('1. Should return a set of microservice names from file content', () => {
    const fileContent = 'MICROSERVICE_ONE=value1\nMICROSERVICE_TWO=value2\n';

    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(fileContent);
    jest.spyOn(federationUtils, 'readFileIfExists').mockReturnValueOnce(fileContent);

    const result = federationUtils.getFederationServices();

    expect(result).toEqual(new Set(['', 'microservice-one', 'microservice-two']));
    jest.restoreAllMocks();
  });

  it('2. Should return an empty set if the file is empty', () => {
    const fileContent = '';

    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(fileContent);
    jest.spyOn(federationUtils, 'readFileIfExists').mockImplementationOnce(() => fileContent);
    jest.spyOn(federationUtils, 'parseMicroserviceName').mockReturnValue('');

    const result = federationUtils.getFederationServices();

    expect(result).toEqual(new Set(['']));
    jest.restoreAllMocks();
  });
});

describe('getAffectedFederationServices', () => {
  jest.mock('../../../src/utils/affected/get-affected-federation-services', () => ({
    getFederationServices: jest.fn(),
  }));

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('1. Should return an array of affected federation services', () => {
    const affectedApps = ['app1', 'app2', 'federation'];
    const federationServices = new Set(['test', 'app1', 'app2', 'federation']);
    jest.spyOn(federationUtils, 'getFederationServices').mockReturnValueOnce(federationServices);
    const result = federationUtils.getAffectedFederationServices(affectedApps);
    expect(result).toEqual(['app1', 'app2', 'federation']);
  });
  it('2. Should return an empty array if no affected federation services are found', () => {
    const affectedApps = ['app3', 'app4'];
    const federationServices = new Set(['', 'app1', 'app2', 'federation']);

    jest.spyOn(federationUtils, 'getFederationServices').mockReturnValueOnce(federationServices);
    const result = federationUtils.getAffectedFederationServices(affectedApps);
    expect(result).toEqual([]);
  });
});

describe('getFederationProjects', () => {
  jest.mock('../../../src/utils/affected/get-affected-federation-services', () => ({
    readFileIfExists: jest.fn(),
  }));

  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('1. Should return a set of affected projects from file content', () => {
    const fileContent = 'PROJECT_ONE=value1\nPROJECT_TWO=value2\n';

    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(fileContent);
    jest.spyOn(federationUtils, 'readFileIfExists').mockReturnValueOnce(fileContent);

    const result = federationUtils.getFederationProjects();
    expect(result).toEqual(
      new Set([
        { name: 'project-one', path: 'value1' },
        { name: 'project-two', path: 'value2' },
      ])
    );
  });

  it('2. Should return an empty set if the file is empty', () => {
    const fileContent = '';

    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(fileContent);
    jest.spyOn(federationUtils, 'readFileIfExists').mockReturnValueOnce(fileContent);

    const result = federationUtils.getFederationProjects();
    expect(result).toEqual(new Set());
  });
});

describe('getAffectedFederationProjects', () => {
  jest.mock('../../../src/utils/affected/get-affected-federation-services', () => ({
    getFederationProjects: jest.fn(),
  }));

  it('1. Should return an array of affected federation projects', () => {
    const affectedApps = ['app1', 'app2', 'app3'];
    const projects = new Set([
      { name: 'app1', path: 'value1' },
      { name: 'app2', path: 'value2' },
    ]);
    jest.spyOn(federationUtils, 'getFederationProjects').mockReturnValueOnce(projects);
    const result = federationUtils.getAffectedFederationProjects(affectedApps);
    expect(result).toEqual([
      { name: 'app1', path: 'value1' },
      { name: 'app2', path: 'value2' },
    ]);
    jest.restoreAllMocks();
  });
});
