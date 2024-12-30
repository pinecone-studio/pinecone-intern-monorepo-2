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
    cy.get('[data-cy="order-info-title"]').should('exist').and('contain.text', 'Захиалгын мэдээлэл');
  });
  it('should display the user info form with initial values', () => {
    cy.get('[data-cy="password-state-button"]').click();
    cy.get('[data-cy="password-info-heading"]').should('exist').and('contain.text', 'Нууц үг сэргээх');
  });
  it('should validate fields and show error messages', () => {
    cy.get('[data-cy="info-state-button"]').click();
    cy.get('[data-cy="Info-Submit-Button"]').click();
    cy.get('[data-cy="form-message-phoneNumber"]').should('contain.text', 'Must be a valid mobile number');
    cy.get('[data-cy="form-message-email"]').should('contain.text', 'Email must be at least 2 characters.');
  });
  it('should fill in the form and submit successfully', () => {
    interceptGraphql({
      state: 'success',
      operationName: 'ChangePassword',
      data: {
        data: {
          changePassword: { success: true },
        },
      },
    });
    cy.get('[data-cy="password-state-button"]').click();
    cy.get('[data-cy="input-current-password"]').type('oldPassword123');
    cy.get('[data-cy="input-new-password"]').type('newPassword@123');
    cy.get('[data-cy="input-confirm-password"]').type('newPassword@123');
    cy.get('[data-cy="Password-Submit-Button"]').click();
    cy.get('.toast').should('contain', 'Password successfully updated');
  });
  it('should show an error if the passwords do not match', () => {
    cy.get('[data-cy="password-state-button"]').click();
    cy.get('[data-cy="input-current-password"]').type('oldPassword123');
    cy.get('[data-cy="input-new-password"]').type('newPassword@123');
    cy.get('[data-cy="input-confirm-password"]').type('differentPassword@123');
    cy.get('[data-cy="Password-Submit-Button"]').click();
    cy.get('[data-cy="form-message-confirm-password"]').should('contain', 'Passwords do not match');
  });
  it('should show an error if the new password does not meet criteria', () => {
    interceptGraphql({
      state: 'error',
      operationName: 'ChangePassword',
      data: { errors: [{ message: 'New password does not meet criteria' }], data: null },
    });
    cy.get('[data-cy="password-state-button"]').click();
    cy.get('[data-cy="input-current-password"]').type('oldPassword123');
    cy.get('[data-cy="input-new-password"]').type('short');
    cy.get('[data-cy="input-confirm-password"]').type('short');
    cy.get('[data-cy="Password-Submit-Button"]').click();
  });
  it('should disable the submit button while loading', () => {
    cy.get('[data-cy="password-state-button"]').click();
    cy.get('[data-cy="input-current-password"]').type('oldPassword123');
    cy.get('[data-cy="input-new-password"]').type('newPassword@123');
    cy.get('[data-cy="input-confirm-password"]').type('newPassword@123');
    cy.intercept('POST', '/graphql', { statusCode: 200, body: {} }).as('changePassword');
    cy.get('[data-cy="Password-Submit-Button"]').click();
  });
});
