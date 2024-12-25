describe('Guest info page', () => {
  beforeEach(() => {
    cy.visit('/guests/guests-info/6757dfb4687cb83ca69ff3cb');
  });
  it('1.Should render the booking info page', () => {
    cy.get('[data-cy=Guests-Info-Page]').should('exist');
    cy.get('[data-cy=Guests-Info-Content-Section]').should('exist');
  });
});
