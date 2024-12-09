import { execSync, spawn } from 'child_process';
import { ProjectPreview } from '../federation/federation-projects-action-utils';

export const getProjectInfo = (project: string) => {
  const command = `npx nx show project ${project}`;
  const projectInfo = execSync(command).toString().trim();
  return JSON.parse(projectInfo);
};

export const doesProjectHaveE2ECommand = (project: string) => {
  const projectInfo = getProjectInfo(project);
  return projectInfo.targets['e2e'];
};

export const isCommandFailed = (code: number) => {
  if (code !== 0) {
    throw new Error(`Command failed with exit code ${code}`);
  } else {
    return true;
  }
};

export const runE2ECommand = async (projectWithE2E: string | undefined, project: ProjectPreview) => {
  if (projectWithE2E) {
    const command = `yarn nx e2e ${project.name} --verbose --baseUrl=${project.url} --skipServe --devServerTarget=""`;
    const childProcess = spawn(command, [], { shell: true });
    childProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    childProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });
    await new Promise((resolve, reject) => {
      childProcess.on('close', (code) => {
        try {
          isCommandFailed(code);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
};

export const runE2EActionAgainstPreviewLink = async (previewData: ProjectPreview[]) => {
  for (const project of previewData) {
    const projectWithE2E = doesProjectHaveE2ECommand(project.name);

    await runE2ECommand(projectWithE2E, project).catch((err) => {
      console.log('This is error', err);
      process.exit(1);
    });
  }
};
