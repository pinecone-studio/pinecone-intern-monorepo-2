import { blue, green } from 'chalk';
import { spawnSync } from 'child_process';
import { getAffectedApps } from '../utils';

export const runCommandOnAffectedProject = (projectName: string, command: string): void => {
  console.log(blue(`\n > Running ${command} for ${projectName} ... \n`));
  const args = ['nx', command, projectName];
  const output = spawnSync('npx', args, { stdio: 'inherit' });

  if (output.status === 0) {
    console.log(green(`\n > Successfully ${command} the project ${projectName} \n`));
  } else {
    throw new Error(`${command} failed on ${projectName}. Check the console for more information.`);
  }
};

export const runChecksOnAffectedApps = (target: string, action: string) => {
  const affectedApps = getAffectedApps(`--with-target ${target}`);
  for (const app of affectedApps) {
    runCommandOnAffectedProject(app, action);
  }
};

export const performPreCommitChecks = () => {
  runChecksOnAffectedApps('lint', 'lint');
  runChecksOnAffectedApps('build', 'build');
};
