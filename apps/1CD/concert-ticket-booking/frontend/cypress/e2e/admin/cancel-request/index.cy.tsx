import { interceptGraphql } from 'cypress/utils/intercept-graphql';

describe('CancelRequestPage', () => {
  beforeEach(() => {
    cy.visit('/user/sign-in');
    cy.get('input[name="email"]').type('adminDev@gmail.com');
    cy.get('input[name="password"]').type('@Pi88923');
    cy.get('[data-cy="Sign-In-Submit-Button"]').should('be.visible').click();
    cy.get('.toast').should('contain', 'Successfully login');
    cy.url().should('include', '/admin/home');
    cy.visit('/admin/cancel-request');
  });

  it('should display an error message if there is an error fetching data', () => {
    interceptGraphql({
      state: 'error',
      operationName: 'GetRequests',
      data: {
        errors: [
          {
            message: 'Data fetch failed',
          },
        ],
        data: null,
      },
    });
    cy.get('[data-cy=error-text]').should('be.visible').and('contain.text', 'Data fetch failed');
  });

  it('should display the requests table when data is loaded', () => {
    cy.get('[data-cy=loading-text]').should('be.visible');
    cy.get('[data-cy=request-table]').should('be.visible');
  });

  it('should close the modal after submitting the status change', () => {
    interceptGraphql({
      state: 'success',
      operationName: 'ChangeStatus',
      data: {
        data: [
          {
            message: 'success',
          },
        ],
      },
    });
    cy.get('[data-cy="loading-text"]').should('be.visible');
    cy.get('[data-cy="request-table"]').should('be.visible');
    cy.get('[data-cy="status-change-trigger-0"]').should('be.visible').click();
    cy.get('[data-cy="status-change-dialog-title"]').should('be.visible');
    cy.get('[data-cy="status-change-submit-button"]').click();
    cy.get('[data-cy="status-change-modal"]').should('not.exist');
  });
  it('should got error message', () => {
    interceptGraphql({
      state: 'error',
      operationName: 'ChangeStatus',
      data: {
        errors: [
          {
            message: 'something wrong',
          },
        ],
        data: null,
      },
    });
    cy.get('[data-cy="loading-text"]').should('be.visible');
    cy.get('[data-cy="request-table"]').should('be.visible');
    cy.get('[data-cy="status-change-trigger-0"]').should('be.visible').click();
    cy.get('[data-cy="status-change-dialog-title"]').should('be.visible');
    cy.get('[data-cy="status-change-submit-button"]').click();
    cy.get('.toast').should('contain.text', 'something wrong');
  });
});
