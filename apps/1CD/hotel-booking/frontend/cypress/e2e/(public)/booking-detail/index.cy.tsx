describe('bookind detail page e2e test', () => {
  beforeEach(() => {
    cy.visit('/booking-detail');
  });
  it('1. ', () => {
    cy.get('[data-cy=Booking-Detail-Home-Page]').should('be.visible');
  });
});
