describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('1. Should render add-hotel', () => {
    cy.get('[data-cy=hello]').should('be.visible');
  });
});
