describe('bookind page e2e test', () => {
  beforeEach(() => {
    cy.visit('/booking');
  });

  it('1. should show booking page', () => {
    cy.get('[data-cy="confirmed-booking"]').should('be.visible');
  });
  it('2. should show view button', () => {
    cy.get('[data-cy="view-button"]').should('be.visible');
  });
  it('3. should click the view button', () => {
    cy.get('[data-cy="view-button"]').first().click();
    cy.visit('/booking-detail/6757dfb4687cb83ca69ff3cb');
  });
});
