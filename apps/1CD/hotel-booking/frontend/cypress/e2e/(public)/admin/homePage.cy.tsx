describe('homePage', () => {
  it('should render', () => {
    cy.visit('/add-hotel/home-page');
    cy.get('[data-cy=Home-Page-Div]').should('be.visible');
  });
  it('1. should show add bu');
});
