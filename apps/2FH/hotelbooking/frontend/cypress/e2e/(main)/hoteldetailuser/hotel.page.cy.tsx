describe('Hotel Detail Page', () => {
  it('should render hotel details page', () => {
    cy.visit('/hotel/1');

    cy.get('[data-cy="hotel-detail-page"]').should('be.visible');
    cy.get('[data-cy="hotel-detail-page"]').should('contain.text', 'Excellent');
  });
});
