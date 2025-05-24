/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  import { CallQueryProps } from 'cypress/utils/call-query';
  import { InterceptGraphqlType } from 'cypress/utils/intercept-graphql';

  interface Chainable<Subject> {
    interceptGraphql(props: InterceptGraphqlType): void;
  }
}
