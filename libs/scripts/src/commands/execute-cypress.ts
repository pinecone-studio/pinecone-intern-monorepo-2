import { green, red } from 'chalk';
import { execSync, spawn } from 'child_process';
import { checkCypressCodeCoverage } from '../actions/e2e/check-cypress-code-coverage';

export const executeCypressTest = async () => {
  const app = process.argv.slice(2)[0];
  const { root } = JSON.parse(execSync(`npx nx show project ${app}`).toString().trim());

  const result = await new Promise((resolve, _reject) => {
    const command = `npx nx cypress ${process.argv.slice(2).join(' ')} --parallel`;
    const childProcess = spawn(command, [], { shell: true });

    childProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    childProcess.on('error', (data) => {
      console.error(data.toString());
      resolve('Failed');
    });

    childProcess.on('close', () => {
      console.log(red('closed'));
      resolve('Pass');
    });
  });

  console.log(`> npx mochawesome-merge ${root}/cypress/results/*.json -o ${root}/.nyc_output/out.json`);
  execSync(`npx mochawesome-merge ${root}/cypress/results/*.json -o ${root}/.nyc_output/out.json`);
  console.log(green('Success mochawesome-merge'));

  console.log(`> npx marge ${root}/.nyc_output/out.json -o ${root}/.nyc_output`);
  execSync(`npx marge ${root}/.nyc_output/out.json -o ${root}/.nyc_output -f index.html`);
  console.log(green('Success marge'));

  console.log(`> npx nx check-cypress-code-coverage scripts ${root}`);
  checkCypressCodeCoverage(root);

  if (result === 'Failed') process.exit(1);

  console.log(green('Success check-cypress-code-coverage scripts'));
};

executeCypressTest();
