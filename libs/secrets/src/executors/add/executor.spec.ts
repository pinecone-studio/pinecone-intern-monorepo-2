import { ExecutorContext } from '@nx/devkit';
import executor, { AddSecretExecutorOptions } from './executor';

jest.mock('../../models', () => ({
  SecretGroupModel: {
    findOne: jest
      .fn()
      .mockResolvedValueOnce({
        secrets: {
          dev: {},
          prod: {},
          test: {},
        },
      })
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        groupName: 'group',
        secrets: {},
      })
      .mockResolvedValueOnce({
        groupName: 'group',
      }),
    create: jest.fn().mockResolvedValue({
      groupName: 'group',
      secrets: {
        dev: {},
        prod: {},
        test: {},
      },
    }),
    updateOne: jest.fn().mockResolvedValue({
      groupName: 'group',
      secrets: {
        dev: {},
        prod: {},
        test: {},
      },
    }),
  },
}));

jest.mock('../../utils', () => ({
  connectToDatabase: jest.fn().mockResolvedValue(true),
  disconnectFromDatabase: jest.fn().mockResolvedValue(true),
}));

jest.mock('fs/promises', () => ({
  writeFile: jest.fn().mockResolvedValue(true),
}));

describe('Add Executor', () => {
  it('update existing', async () => {
    const options: AddSecretExecutorOptions = {
      group: 'group',
      env: 'dev',
      username: 'developer',
      password: 'password',
      key: 'key',
      value: 'value',
    };

    const context = {} as ExecutorContext;

    const output = await executor(options, context);

    expect(output.success).toBe(true);
  });

  it('create and update', async () => {
    const options: AddSecretExecutorOptions = {
      group: 'group',
      env: 'dev',
      username: 'developer',
      password: 'password',
      key: 'key',
      value: 'value',
    };

    const context = {} as ExecutorContext;

    const output = await executor(options, context);

    expect(output.success).toBe(true);
  });

  it('run without options', async () => {
    const options: AddSecretExecutorOptions = {};

    const context = {} as ExecutorContext;

    const output = await executor(options, context);

    expect(output.success).toBe(false);
  });
});
