import { ExecutorContext } from '@nx/devkit';
import executor, { GetSecretsExecutorOptions } from './executor';

jest.mock('../../models', () => ({
  SecretGroupModel: {
    find: jest
      .fn()
      .mockResolvedValueOnce([
        {
          secrets: {
            dev: {
              SECRET1: 'secret1',
              SECRET2: 'secret2',
            },
            prod: {},
            test: {},
          },
        },
      ])
      .mockResolvedValueOnce([]),
  },
}));

jest.mock('../../utils', () => ({
  connectToDatabase: jest.fn().mockResolvedValue(true),
  disconnectFromDatabase: jest.fn().mockResolvedValue(true),
}));

jest.mock('fs/promises', () => ({
  writeFile: jest.fn().mockResolvedValue(true),
}));

describe('Get Executor', () => {
  it('can run', async () => {
    const options = {
      groups: ['group1'],
      env: 'dev',
    } as GetSecretsExecutorOptions;

    const context = {
      projectName: 'project1',
      projectsConfigurations: {
        projects: {
          project1: {
            root: 'root',
          },
        },
      },
    } as unknown as ExecutorContext;

    const output = await executor(options, context);

    expect(output.success).toBe(true);
  });

  it('can run without options but throw no group error', async () => {
    const options = {} as GetSecretsExecutorOptions;

    const context = {
      projectName: 'project1',
      projectsConfigurations: {
        projects: {
          project1: {
            root: 'root',
          },
        },
      },
    } as unknown as ExecutorContext;

    const output = await executor(options, context);

    expect(output.success).toBe(false);
  });
});
