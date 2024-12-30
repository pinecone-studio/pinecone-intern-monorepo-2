describe('Guest info page', () => {
  beforeEach(() => {
    cy.intercept('POST', '/graphql', (req) => {
      if (req.body.operationName === 'GetBooking') {
        req.reply({
          data: {
            getBooking: {
              id: '1',
              name: 'Shagai Nymdorj',
              room: 'Deluxe Room',
              checkIn: '2024-12-29',
              checkOut: '2024-12-31',
            },
          },
        });
      }
    });
    cy.visit('/guests/guests-info/1');
  });

  it('1.Should render the booking info page', () => {
    cy.get('[data-cy="Guest-Info-Page"]').should('be.visible');
  });
  it('2.Should navigate to the correct guest info page when clicked', () => {
    cy.get('[data-cy="Guest-Info-Router"]').click();
    cy.url().should('include', '/guests/guests-info/1');
    cy.get('[data-cy="Guest-Info-Page"]').should('exist');
  });
});
