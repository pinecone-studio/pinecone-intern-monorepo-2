import { interceptGraphql } from 'cypress/utils/intercept-graphql';
/// <reference types="cypress" />

Cypress.Commands.add('interceptGraphql', interceptGraphql);

// interface NewChainable extends Chainable<any> {
//   setAccessToken: (token: string) => void;
// }
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     setAccessToken(accessToken: string): Chainable<Subject>;
//   }
// }

const loginWithFakeToken = (location: string, accessToken: string) => {
  cy.visit(location, {
    onBeforeLoad: (win) => {
      win.localStorage.setItem('token', accessToken);
    },
  });
};

Cypress.Commands.add('loginWithFakeToken', loginWithFakeToken);
