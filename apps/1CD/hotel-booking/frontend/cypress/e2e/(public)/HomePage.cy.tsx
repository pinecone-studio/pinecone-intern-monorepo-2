describe('HomePage', () => {
  it('should render', () => {
    cy.visit('/');
    cy.get('[HomePage]').should('be.visible');
    cy.get('[HomePage]').should('have.value', '');
  });
});
