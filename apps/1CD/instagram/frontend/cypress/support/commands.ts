import { interceptGraphql } from 'cypress/utils/intercept-graphql';
/// <reference types="cypress" />

Cypress.Commands.add('interceptGraphql', interceptGraphql);
Cypress.Commands.add('setAccessToken', (accessToken) => {
  cy.window().then((win) => {
    win.localStorage.setItem('accessToken', accessToken);
  });
});

describe;
