/* eslint-disable no-control-regex */
import { green, red } from 'chalk';
import { execSync } from 'child_process';
type ExtractDeployedURLFromCommandResultType = {
  app: string;
  deploymentCommandResult: string;
  deploymentCommand: string;
};

type DeployProjectType = {
  app: string;
  deploymentCommand: string;
};

type DeployedProjectType = {
  name: string;
  url: string;
};

export const extractDeployedURLFromCommandResult = ({ app, deploymentCommandResult, deploymentCommand }: ExtractDeployedURLFromCommandResultType) => {
  const resultLines = deploymentCommandResult.split('\n');
  const deployedLink = resultLines.reverse().find((line) => line.trim().startsWith(`https://`));
  if (deployedLink) {
    const url = deployedLink.trim();
    console.log(`${red(`${deploymentCommand} URL for ${app.toUpperCase()}`)}: ${green(url)}`);
    return url;
  } else {
    throw new Error(`${app} URL not found in the command output from this command result: ${deploymentCommandResult}`);
  }
};

export const runDeploymentCommand = async ({ deploymentCommand, app }: DeployProjectType) => {
  const command = `npx nx ${deploymentCommand} ${app} --verbose`;
  const deploymentCommandResult = execSync(command, { stdio: ['inherit'] })
    .toString()
    .trim();

  console.log(green(`Preview command result for ${app}`));
  console.log(deploymentCommandResult);

  return deploymentCommandResult;
};

export const handleError = (error) => {
  if (error.stderr) {
    throw new Error(error.stdout.toString());
  } else {
    throw error;
  }
};

export const deployProject = async ({ deploymentCommand, app }: DeployProjectType) => {
  console.log(green(`Running ${deploymentCommand} command on ${app}`));
  const deploymentCommandResult = await runDeploymentCommand({ app, deploymentCommand });
  const deployedLink = extractDeployedURLFromCommandResult({ app, deploymentCommandResult, deploymentCommand });
  return deployedLink;
};

const deployProjectsInSequence = async (affectedApps: string[], deploymentCommand: string): Promise<DeployedProjectType[]> => {
  const deployedProjects: DeployedProjectType[] = [];

  for (const app of affectedApps) {
    const url = await deployProject({ app, deploymentCommand });
    deployedProjects.push({ name: app, url });
  }

  return deployedProjects;
};

export const deployProjects = async (affectedApps: string[], deploymentCommand: string): Promise<DeployedProjectType[]> => {
  try {
    return await deployProjectsInSequence(affectedApps, deploymentCommand);
  } catch (error) {
    console.error(`Error occurred during deployment while running ${deploymentCommand}: ${error.message}`);
    handleError(error);
  }
};
