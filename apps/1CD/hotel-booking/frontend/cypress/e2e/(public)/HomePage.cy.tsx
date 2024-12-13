describe('HomePage', () => {
  it('should render', () => {
    cy.visit('/');
    cy.get('[data-cy=Home-Page]').should('be.visible');
    cy.get('[data-cy=Popular-Hotels]').should('contain.text', 'Popular Hotels');
  });
});
