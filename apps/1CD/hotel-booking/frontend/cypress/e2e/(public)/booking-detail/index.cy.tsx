describe('bookind detail page e2e test', () => {
  beforeEach(() => {
    cy.visit('/booking-detail/6757dfb4687cb83ca69ff3cb');
  });
  it('1. ', () => {
    cy.get('[data-cy=Booking-Detail-Home-Page]').should('be.visible');
  });
});
