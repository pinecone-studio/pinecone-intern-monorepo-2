import { ExecutorContext } from '@nx/devkit';
import { SecretGroupModel } from '../../models';
import { connectToDatabase, disconnectFromDatabase } from '../../utils';
import * as yup from 'yup';

export type Executor<Options> = (_options: Options, _context: ExecutorContext) => Promise<{ success: boolean }>;

export type AddSecretExecutorOptions = {
  group?: string;
  env?: 'dev' | 'prod' | 'test';
  username?: string;
  password?: string;
  key?: string;
  value?: string;
};

const validatation = yup.object({
  group: yup.string().required('Group is required'),
  env: yup.string().oneOf(['dev', 'prod', 'test'], 'Invalid env').required('Env is required'),
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
  key: yup.string().required('Key is required'),
  value: yup.string().required('Value is required'),
});

const runAddSecretExecutor: Executor<AddSecretExecutorOptions> = async (options) => {
  try {
    const { group = '', env = '', username = '', password = '', key = '', value = '' } = options;

    await validatation.validate({
      group,
      env,
      username,
      password,
      key,
      value,
    });

    await connectToDatabase({
      username,
      password,
    });

    let secretGroup = await SecretGroupModel.findOne({
      groupName: group,
    });

    if (!secretGroup) {
      secretGroup = await SecretGroupModel.create({
        groupName: group,
        secrets: {
          test: {},
          prod: {},
          dev: {},
        },
      });
    }

    const secrets = secretGroup.secrets[env];

    await SecretGroupModel.updateOne(
      {
        groupName: group,
      },
      {
        $set: {
          secrets: {
            ...secretGroup.secrets,
            [env]: {
              ...secrets,
              [key.toUpperCase()]: value,
            },
          },
        },
      }
    );

    return { success: true };
  } catch (error) {
    console.error('Error: ', error);
    return { success: false };
  } finally {
    await disconnectFromDatabase();
  }
};

export default runAddSecretExecutor;
