import chalk from 'chalk';
import { spawn } from 'child_process';
import fs from 'fs';

export const runSelectedServices = (serviceName) => {
  return new Promise<void>((resolve, reject) => {
    const command = `npx nx serve ${serviceName}`;
    const serverProcess = spawn(command, [], { shell: true });
    let localhostURL = null;

    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`${chalk.green(serviceName)} log => ${chalk.yellow(output)}`);

      const match = output.match(/url:\s+(http:\/\/localhost:\d+)/);

      if (match) {
        localhostURL = match[1];
        console.log(
          chalk.green(
            `Localhost URL for service ${serviceName}: ${localhostURL}/api/graphql`
          )
        );
        updateEnvFile(serviceName, localhostURL);
        resolve();
      }
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(`Server error: ${data}`);
      reject(new Error(`Server error for service ${serviceName}`));
    });

    serverProcess.on('close', (code) => {
      console.log(`Server exited with code ${code}`);
      reject(
        new Error(`Server exited with code ${code} for service ${serviceName}`)
      );
    });
  });
};

const updateEnvFile = (serviceName, localhostURL) => {
  const envFile = `apps/federation/.env.local`;
  const envContent = fs.readFileSync(envFile, 'utf8');
  const uppercaseString = serviceName.replace(/-/g, '_').toUpperCase();
  const updatedContent = envContent.replace(
    new RegExp(`^${uppercaseString}=.*$`, 'gm'),
    `${uppercaseString}=${localhostURL}/api/graphql`
  );
  fs.writeFileSync(envFile, updatedContent);
  console.log(
    chalk.yellow(
      `.env file updated for service ${serviceName} with localhost URL.`
    )
  );
};
