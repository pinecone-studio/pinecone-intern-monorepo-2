/// <reference types="cypress" />

import { interceptGraphql } from 'cypress/utils/intercept-graphql';

describe('InputArtists Component', () => {
  beforeEach(() => {
    const mockToken = {
      token: 'faketoken',
    };
    cy.window().then((window) => {
      window.localStorage.setItem('token', JSON.stringify(mockToken));
    });
    interceptGraphql({
      state: '',
      operationName: 'GetMe',
      data: {
        data: {
          getMe: {
            email: 'example@gmail.com',
            role: 'admin',
            phoneNumber: '+976 95160812',
            __typename: 'User',
          },
        },
      },
    });
    cy.visit('/admin/home');
  });

  it('should add and remove main artist inputs', () => {
    cy.get('[data-testid="create-event-button"]').click();

    cy.get('[data-testid="add-main-artist-button"]').click();
    cy.get('[data-testid="main-artist-name-input-1"]').should('exist');
    cy.get('[data-testid="remove-main-artist-button-1"]').click();
    cy.get('[data-testid="main-artist-name-input-1"]').should('not.exist');
  });
  it('should not have empty input fields after removal', () => {
    cy.get('[data-testid="create-event-button"]').click();
    cy.get('[data-testid="remove-main-artist-button-0"]').click();
    cy.get('[data-testid="main-artist-name-input-0"]').should('not.exist');
  });
  it('should display proper artist names when added', () => {
    cy.get('[data-testid="create-event-button"]').click();
    cy.get('[data-testid="main-artist-name-input-0"]').type('Main Artist 1');
    cy.get('[data-testid="guest-artist-name-input-0"]').type('Guest Artist 1');
    cy.get('[data-testid="main-artist-name-input-0"]').should('have.value', 'Main Artist 1');
    cy.get('[data-testid="guest-artist-name-input-0"]').should('have.value', 'Guest Artist 1');
  });
  it('should not have empty input fields for guest artists after removal', () => {
    cy.get('[data-testid="create-event-button"]').click();
    cy.get('[data-testid="guest-artist-name-input-0"]').should('exist');
    cy.get('[data-testid="add-guest-artist-button"]').click();
    cy.get('[data-testid="guest-artist-name-input-1"]').should('exist');
    cy.get('[data-testid="remove-guest-artist-button-1"]').click();
    cy.get('[data-testid="guest-artist-name-input-1"]').should('not.exist');
  });
  it('should not have empty input fields for guest artists after removal', () => {
    cy.get('[data-testid="create-event-button"]').click();
    cy.get('[data-testid="remove-guest-artist-button-0"]').click();
    cy.get('[data-testid="guest-artist-name-input-0"]').should('not.exist');
  });
});
