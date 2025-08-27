import { interceptGraphql } from 'cypress/utils/intercept-graphql';
/// <reference types="cypress" />

Cypress.Commands.add('interceptGraphql', interceptGraphql);

// Custom commands энд нэмж болно
// Жишээ:
/*
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-testid=email]').type(email);
  cy.get('[data-testid=password]').type(password);
  cy.get('[data-testid=submit]').click();
});
*/

// Type definitions for custom commands
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Cypress {
      // eslint-disable-next-line @typescript-eslint/no-empty-interface
      interface Chainable {
        // login(email: string, password: string): Chainable<void>;
      }
    }
  }

  export {};
