

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
    specPattern: ['./cypress/e2e/render-all-pages.cy.tsx', './cypress/e2e/**/*.cy.tsx'],
    screenshotsFolder: './cypress/results/assets',
    videosFolder: './cypress/results/assets',
    viewportWidth: 1536,
    viewportHeight: 960,
    pageLoadTimeout: 120000, 
    defaultCommandTimeout: 30000, 
    responseTimeout: 120000, 
    screenshotOnRunFailure: true,
    numTestsKeptInMemory: 0,
    requestTimeout: 60000, 
    trashAssetsBeforeRuns: true,
    retries: 2,
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
  },
};

export default config;
