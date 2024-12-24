/// <reference types="cypress" />

import { interceptGraphql } from 'cypress/utils/intercept-graphql';

describe('UserInfo Component', () => {
  beforeEach(() => {
    const mockToken = {
      token: 'faketoken',
    };
    cy.window().then((window) => {
      window.localStorage.setItem('token', JSON.stringify(mockToken));
    });
    cy.visit('/user/home/user-profile');
  });
  it('should display the user info form with initial values from localStorage', () => {
    interceptGraphql({
      state: '',
      operationName: 'GetMe',
      data: {
        data: {
          getMe: {
            email: 'example@gmail.com',
            role: 'user',
            phoneNumber: '+976 95160812',
            __typename: 'User',
          },
        },
      },
    });
    cy.get('[data-cy="info-state-button"]').click();
    cy.get('[data-cy="user-info-heading"]').should('exist').and('contain.text', 'Хэрэглэгчийн мэдээлэл');
    cy.get('[data-cy="input-phoneNumber"]').should('have.value', '+976 95160812');
    cy.get('[data-cy="input-email"]').should('have.value', 'example@gmail.com');
  });
  it('should display the user info form with initial values from localStorage and check if phonenumber does not exist', () => {
    interceptGraphql({
      state: '',
      operationName: 'GetMe',
      data: {
        data: {
          getMe: {
            email: 'example@gmail.com',
            role: 'user',
            __typename: 'User',
          },
        },
      },
    });
    cy.get('[data-cy="info-state-button"]').click();
    cy.get('[data-cy="input-phoneNumber"]').should('have.value', '');
    cy.get('[data-cy="input-email"]').should('have.value', 'example@gmail.com');
  });
  it('should display the user info form with initial values', () => {
    interceptGraphql({
      state: '',
      operationName: 'UpdateUser',
      data: {
        data: {
          recoverPassword: {
            role: 'user',
            __typename: 'User',
          },
        },
      },
    });
    cy.get('[data-cy="info-state-button"]').click();
    cy.get('[data-cy="user-info-heading"]').should('exist').and('contain.text', 'Хэрэглэгчийн мэдээлэл');
    cy.get('[data-cy="input-email"]').type('newemail@example.com');
    cy.get('[data-cy="input-phoneNumber"]').type('1234567890');
    cy.get('[data-cy="Info-Submit-Button"]').click();
    cy.get('.toast').should('contain', 'Successfully updated');
  });
  it('should display the user info form with initial values', () => {
    interceptGraphql({
      state: 'error',
      operationName: 'UpdateUser',
      data: {
        errors: [
          {
            message: 'User not found',
          },
        ],
        data: null,
      },
    });
    cy.get('[data-cy="info-state-button"]').click();
    cy.get('[data-cy="input-email"]').type('newemail@example.com');
    cy.get('[data-cy="input-phoneNumber"]').type('1234567890');
    cy.get('[data-cy="Info-Submit-Button"]').click();
    cy.get('.toast').should('contain', 'User not found');
  });

  it('should display the user info form with initial values', () => {
    cy.get('[data-cy="order-state-button"]').click();
    cy.get('[data-cy="order-info-heading"]').should('exist').and('contain.text', ' Захиалгын түүх');
  });
  it('should display the user info form with initial values', () => {
    cy.get('[data-cy="password-state-button"]').click();
    cy.get('[data-cy="password-info-heading"]').should('exist').and('contain.text', ' Нууц үг сэргээх');
  });

  it('should validate fields and show error messages', () => {
    cy.get('[data-cy="info-state-button"]').click();
    cy.get('[data-cy="Info-Submit-Button"]').click();
    cy.get('[data-cy="form-message-phoneNumber"]').should('contain.text', 'Must be a valid mobile number');
    cy.get('[data-cy="form-message-email"]').should('contain.text', 'Email must be at least 2 characters.');
  });
});
