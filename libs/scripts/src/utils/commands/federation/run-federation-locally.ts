import chalk from 'chalk';
import { spawn } from 'child_process';

export const runFederationLocally = () => {
  const command =
    'npx env-cmd -f apps/federation/.env.local nx serve federation --configuration=local';
  const serverProcess = spawn(command, [], { shell: true });
  serverProcess.stdout.on('data', (data) => {
    const log = data.toString();
    if (log.includes('Listening at http://localhost:3333/graphql')) {
      console.log(chalk.green(`Server output: ${log}`));
    }
  });
  serverProcess.stderr.on('data', (data) => {
    console.error(`Server error: ${data}`);
  });
  serverProcess.on('close', (code) => {
    console.error(`Server exited with code ${code}`);
  });
};
