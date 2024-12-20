describe('Detail Page', () => {
  beforeEach(() => {
    cy.visit('user/home/event/[eventId]');
  });
  it('1. Displays detail page top component', () => {
    cy.get('[data-cy="Detail-Page"]').should('be.visible');
    cy.get('[data-cy="DetailTop-Component"]').should('be.visible');
  });
});
