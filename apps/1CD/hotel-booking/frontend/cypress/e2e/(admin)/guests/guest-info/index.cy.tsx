describe('Guest info page', () => {
  beforeEach(() => {
    cy.visit('/guests/info/6783cb82d1f2090809af97a0');
  });
  it('1.Should render the booking info page', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetBooking') {
        req.reply({
          data: {
            getBooking: {
              status: 'booked',
              checkInDate: '2024-12-18',
              checkOutDate: '2025-01-01',
              firstName: 'Shagai',
              lastName: 'Nymdorj',
            },
          },
        });
      }
    });
    cy.get('[data-cy="Guest-Info-Page"]').should('be.visible');
    cy.get('[data-cy=Checkout-Button]').click();
    cy.get('[data-cy=Checkout-Dialog-Content]').should('be.visible');
    cy.get('[data-cy=Checkout-Dialog-Cancel-Button]').click();
    cy.get('[data-cy=Checkout-Button]').click();
    cy.get('[data-cy=Checkout-Dialog-Content]').should('be.visible');
    cy.get('[data-cy=Checkout-Dialog-Update-Status-Button]').click();
    cy.get('[data-cy=Checkout-Dialog-Content]').should('not.exist');
  });
  it('2.Should render the booking status completed', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetBooking') {
        req.reply({
          data: {
            getBooking: {
              status: 'completed',
              checkInDate: '2024-12-18',
              checkOutDate: '2025-01-01',
              firstName: 'Shagai',
              lastName: 'Nymdorj',
            },
          },
        });
      }
    });
    cy.get('[data-cy="Guest-Info-Page"]').should('be.visible');
    // cy.get('[data-cy=Booking-Status-Badge]').should('be.visible');
  });
  it('3.Should render the booking status cancelled', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetBooking') {
        req.reply({
          data: {
            getBooking: {
              status: 'cancelled',
              checkInDate: '2024-12-18',
              checkOutDate: '2025-01-01',
              firstName: 'Shagai',
              lastName: 'Nymdorj',
            },
          },
        });
      }
    });
    cy.get('[data-cy="Guest-Info-Page"]').should('be.visible');
    // cy.get('[data-cy=Booking-Status-Badge]').should('be.visible');
  });
});
