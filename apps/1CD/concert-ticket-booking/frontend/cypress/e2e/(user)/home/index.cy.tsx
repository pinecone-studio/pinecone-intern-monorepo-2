describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/user/home');
  });
  it('3.Displays home page with events', () => {
    cy.get('[data-cy="Home-Page"]').should('be.visible');
    cy.get('[data-cy="Card-Component"]').should('be.visible');
  });
});
