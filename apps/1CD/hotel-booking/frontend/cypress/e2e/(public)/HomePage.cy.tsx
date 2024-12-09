describe('HomePage', () => {
  it('should render', () => {
    cy.visit('/');
    cy.get('[data-cy=Home-Page]').should('be.visible');
  });
});
