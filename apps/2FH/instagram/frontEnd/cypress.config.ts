/* eslint-disable @typescript-eslint/no-var-requires */

import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';

const config: Cypress.ConfigOptions<unknown> = {
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'cypress',
    }),
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config);
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
    pageLoadTimeout: 60000,
    defaultCommandTimeout: 20000,
    responseTimeout: 60000,
    screenshotOnRunFailure: true,
    numTestsKeptInMemory: 0,
    requestTimeout: 30000,
    trashAssetsBeforeRuns: true,
    retries: 2,
    reporter: '../../../node_modules/cypress-multi-reporters',
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

export default defineConfig(config);
