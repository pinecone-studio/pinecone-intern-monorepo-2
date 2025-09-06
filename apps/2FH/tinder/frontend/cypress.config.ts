

import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import codeCoverageTask from '@cypress/code-coverage/task';

const config: Cypress.ConfigOptions<unknown> = {
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'cypress',
    }),
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      return config;
    },
    supportFolder: './cypress/support',
    supportFile: './cypress/support/e2e.ts',
    fileServerFolder: './src',
    specPattern: [], // Skip all e2e tests
    screenshotsFolder: './cypress/results/assets',
    videosFolder: './cypress/results/assets',
    viewportWidth: 1536,
    viewportHeight: 960,
    pageLoadTimeout: 10000,
    defaultCommandTimeout: 10000,
    responseTimeout: 10000,
    screenshotOnRunFailure: true,
    numTestsKeptInMemory: 0,
    requestTimeout: 30000,
    trashAssetsBeforeRuns: true,
    retries: 1,
    reporter: '../../../../node_modules/cypress-multi-reporters',
    reporterOptions: {
      reporterEnabled: 'mochawesome',
      mochawesomeReporterOptions: {
        reportDir: 'cypress/results',
        overwrite: false,
        html: false,
        json: true,
      },
    },
    env: {
      env: {},
    },
    video: false,
    videoCompression: false,
  },
};

export default config;
