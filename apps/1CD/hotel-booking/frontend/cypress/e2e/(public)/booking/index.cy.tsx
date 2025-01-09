describe('booking page e2e test', () => {
  beforeEach(() => {
    cy.visit('/booking');
  });

  it('1. should show booking page', () => {
    cy.get('[data-cy="Confirmed-Booking"]').should('be.visible');
  });
  it('2. should show view button', () => {
    cy.get('[data-cy="View-Button"]').should('be.visible');
  });

  it('3. should render bookingCard', () => {
    cy.get('[data-cy="Booking-Card-Status"]').should('be.visible');
  });
  it('4. should click the view button', () => {
    cy.get('[data-cy="View-Button"]').first().click();
    cy.visit('/booking-detail/6757dfb4687cb83ca69ff3cb');
  });
  it('5. click start exploring button', () => {
    cy.intercept('POST', '/api/graphql', (req) => {
      if (req.body.operationName === 'GetBookingFindByUserId') {
        req.reply({
          data: {
            getBookingFindByUserId: [],
          },
        });
      }
    });

    cy.get('[data-cy=start-exploring-button]').click();
  });
});
