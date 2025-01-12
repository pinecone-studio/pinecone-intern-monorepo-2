describe('Login Page', () => {
  it('Should render login page', () => {
    cy.visit('/login');
    cy.get('[data-cy="Login-Hello-Message"]').should('be.visible');
    cy.get('[data-cy=Login-Hello-Message]').should('have.text', 'Hello From Login Page');
  });
});
