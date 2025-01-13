import { interceptGraphql } from 'cypress/utils/intercept-graphql';

describe('QRGeneratePage', () => {
  beforeEach(() => {
    cy.visit('/user/payment/12345');
  });

  it('should make a payment request and show success message', () => {
    interceptGraphql({
      state: 'success',
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
    cy.get('[data-cy="payment-success-title"]').should('exist');

    cy.wait(3000);
    cy.get('.toast').should('contain.text', 'Thank you for your purchase, please check your email');
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
    cy.wait(3000);
    cy.get('.toast').should('contain.text', 'Payment failed');
  });
});
