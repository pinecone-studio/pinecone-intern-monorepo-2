import { interceptGraphql } from 'cypress/utils/intercept-graphql';

describe('Password Recovery Flow', () => {
  beforeEach(() => {
    cy.visit('/user/recover-password?resetToken=validToken');
  });
  it('should display the recovery form correctly', () => {
    cy.get('[data-cy="Recover-Password-Page"]').should('exist');
    cy.get('[data-cy="form-label-password"]').should('contain', 'Нууц үг');
    cy.get('[data-cy="form-label-repeatPassword"]').should('contain', 'Нууц үг давтах');
    cy.get('[data-cy="input-password"]').should('exist');
    cy.get('[data-cy="input-repeatPassword"]').should('exist');
  });
  it('should show validation errors for invalid form data', () => {
    cy.get('[data-cy="Recover-Password-Submit-Button"]').click();
    cy.get('[data-cy="form-message-password"]').should('contain', 'Be at least 8 characters long');
    cy.get('[data-cy="form-message-repeatPassword"]').should('contain', 'Be at least 8 characters long');
  });
  it('should show password mismatch error', () => {
    cy.get('[data-cy="input-password"]').type('Test@1234');
    cy.get('[data-cy="input-repeatPassword"]').type('Test@5678');
    cy.get('[data-cy="Recover-Password-Submit-Button"]').click();
    cy.get('[data-cy="form-message-repeatPassword"]').should('contain', 'Passwords do not match');
  });
  it('should call the recoverPassword mutation on successful submission', () => {
    interceptGraphql({
      state: '',
      operationName: 'RecoverPassword',
      data: {
        data: {
          recoverPassword: {
            message: 'success',
            __typename: 'Response',
          },
        },
      },
    });
    cy.get('[data-cy="input-password"]').type('Test@1234');
    cy.get('[data-cy="input-repeatPassword"]').type('Test@1234');
    cy.get('[data-cy="Recover-Password-Submit-Button"]').click();
    cy.get('.toast').should('contain', 'Successfully recovered password');
    cy.url().should('include', '/user/sign-in');
  });
  it('should show error message if reset token is expired', () => {
    interceptGraphql({
      state: 'error',
      operationName: 'RecoverPassword',
      data: {
        errors: [
          {
            message: 'Invalid or expired reset token',
          },
        ],
        data: null,
      },
    });
    cy.get('[data-cy="input-password"]').type('Test@1234');
    cy.get('[data-cy="input-repeatPassword"]').type('Test@1234');
    cy.get('[data-cy="Recover-Password-Submit-Button"]').click();
    cy.get('.toast').should('contain', 'Invalid or expired reset token');
  });
  it('should show error message if invalid reset token is used', () => {
    cy.visit('/user/recover-password');
    cy.get('[data-cy="input-password"]').type('Test@1234');
    cy.get('[data-cy="input-repeatPassword"]').type('Test@1234');
    cy.get('[data-cy="Recover-Password-Submit-Button"]').click();
    cy.get('.toast').should('contain', 'Please ensure you are using the correct link or request a new password recovery link.');
  });
});
