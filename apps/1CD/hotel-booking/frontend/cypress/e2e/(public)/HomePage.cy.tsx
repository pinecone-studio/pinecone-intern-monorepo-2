describe('HomePage', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('should render', () => {
    cy.get('[data-cy=Home-Page]').should('be.visible');
    cy.get('[data-cy=Popular-Hotels]').should('contain.text', 'Popular Hotels');
    cy.get('[data-cy=View-All-Btn]').click();
  });
});
