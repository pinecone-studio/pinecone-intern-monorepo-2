import { writeFile } from 'fs/promises';
import { SecretGroupModel } from '../../models';
import { connectToDatabase, disconnectFromDatabase } from '../../utils';
import { Executor } from '../add/executor';
import * as yup from 'yup';

export type GetSecretsExecutorOptions = {
  groups?: string[];
  env?: 'dev' | 'prod' | 'test';
};

const validatation = yup.object({
  groups: yup.array(yup.string()).min(1, 'Groups are empty').required('Groups are required'),
  env: yup.string().oneOf(['dev', 'prod', 'test'], 'Invalid env').required('Env is required'),
});

const runGetSecretsExecutor: Executor<GetSecretsExecutorOptions> = async (options, context) => {
  try {
    const {
      projectName,
      projectsConfigurations: { projects },
    } = context;

    const projectPath = projects[projectName].root;

    const { groups = [], env = 'dev' } = options;

    await validatation.validate({
      groups,
      env,
    });

    await connectToDatabase({});

    const secretGroups = await SecretGroupModel.find({
      groupName: { $in: groups },
    });

    const secrets = secretGroups.reduce((acc, group) => {
      const secrets = group.secrets[env];
      return { ...acc, ...secrets };
    }, {});

    let envContent = '';

    for (const key in secrets) {
      if (Object.hasOwnProperty.call(secrets, key)) {
        envContent += `${key}=${secrets[key]}\n`;
      }
    }

    await writeFile(projectPath + '/.env', envContent);

    return { success: true };
  } catch (error) {
    console.error('Error: ', error);

    return { success: false };
  } finally {
    await disconnectFromDatabase();
  }
};

export default runGetSecretsExecutor;
