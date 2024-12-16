describe('homePage', () => {
  it('should render', () => {
    cy.visit('/add-hotel/home-page');
    cy.get('[data-cy=home-page-div]').should('be.visible');
  });
});
