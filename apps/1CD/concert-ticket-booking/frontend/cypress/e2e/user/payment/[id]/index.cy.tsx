import { interceptGraphql } from 'cypress/utils/intercept-graphql';

describe('QRGeneratePage', () => {
  beforeEach(() => {
    cy.visit('/user/payment/12345');
  });

  it('should make a payment request and show success message', () => {
    interceptGraphql({
      state: '',
      operationName: 'PaymentTickets',
      data: {
        data: {
          paymentTickets: {
            message: 'success',
            __typename: 'Response',
          },
        },
      },
    });
    cy.get('[data-cy="payment-page-title"]').should('exist');
    cy.get('[data-cy="payment-page-title"]').should('contain.text', 'Payment page');
    cy.get('.toast').should('contain', 'Thank you for your purchase, please check your email');
    cy.url().should('include', '/user/home');
  });

  it('should show an error message if the payment fails', () => {
    interceptGraphql({
      state: 'error',
      operationName: 'PaymentTickets',
      data: {
        errors: [
          {
            message: 'Payment failed',
          },
        ],
        data: null,
      },
    });
    cy.get('[data-cy="payment-page-title"]').should('exist');
    cy.get('.toast').should('contain', 'Payment failed');
  });
});
