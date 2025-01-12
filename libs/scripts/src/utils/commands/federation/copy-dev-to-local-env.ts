import chalk from 'chalk';
import { exec } from 'child_process';

export const copyDevToLocalEnv = (sourcePath, destinationPath) => {
  const command = `cp ${sourcePath} ${destinationPath}`;
  exec(command);
  console.log(
    `File copied from ${chalk.yellow(sourcePath)} to ${chalk.yellow(
      destinationPath
    )}`
  );
};
